import logo from "@/assets/logo.png";
import Image from "next/image";
import Link from "next/link";

export default () => {
  return (
    <header id="main-header">
      <Link href="/">
        <Image
          src={logo}
          priority
          width={100}
          height={100}
          alt="Mobile phone with posts feed on it"
        />
      </Link>
      <nav>
        <ul>
          <li>
            <Link href="/feed">Feed</Link>
          </li>
          <li>
            <Link className="cta-link" href="/new-post">
              New Post
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
