"use server";

import { redirect } from "next/navigation";

import { storePost, updatePostLikeStatus } from "@/lib/posts";
import { uploadImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { verifyAuth } from "@/lib/auth";

export const createPost = async (prevState, formData) => {
    const title = formData.get("title");
    const image = formData.get("image");
    const content = formData.get("content");

    let errors = [];

    if (!title || title.trim().length === 0) {
      errors.push("Title is required.");
    }

    if (!content || content.trim().length === 0) {
      errors.push("Content is required.");
    }

    if (!image || image.size === 0) {
      errors.push("Image is required.");
    }

    if (errors.length > 0) {
      return { errors };
    }

    let imageUrl
    try {
      imageUrl = await uploadImage(image);
    } catch (error) {
      throw new Error('Image upload failed, post was not created. Please try again later.');
    }

    const {user} = await verifyAuth();

    await storePost({
      imageUrl,
      title,
      content,
      userId: user.id,
    });

    revalidatePath('/', 'layout');
    redirect("/feed");
  }

  export const togglePostLikeStatus = async (postId, formData) => {
    const {user} = await verifyAuth();
    await updatePostLikeStatus(postId, user.id);
    revalidatePath('/feed');
  }
  