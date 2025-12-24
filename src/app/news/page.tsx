import { redirect } from "next/navigation";

// Temporarily redirecting /news to /blogs
// The news page functionality is preserved in this folder's components
// Restore this page's original content when news page is needed again

export default function NewsPage() {
    redirect("/blogs");
}
