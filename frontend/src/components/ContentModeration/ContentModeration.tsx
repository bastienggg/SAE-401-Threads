import { useState, useEffect } from "react";
import { Search, Ban, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Post } from "../../data/post";
import { ImageCarousel } from "../image-carousel/image-carousel";

interface PostData {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    pseudo: string;
    avatar: string;
  };
  like_count: number;
  is_censored?: boolean;
  media?: string[];
}

export default function ContentModeration() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const postsPerPage = 20;

  const fetchPosts = async (page: number) => {
    const token = sessionStorage.getItem("Token");
    if (!token) return;

    try {
      const data = await Post.getPost(token, page);
      if (data && data.posts) {
        if (page === 1) {
          setPosts(data.posts);
        } else {
          setPosts(prevPosts => [...prevPosts, ...data.posts]);
        }
        setHasMorePages(!!data.next_page);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleCensor = async (postId: number) => {
    const token = sessionStorage.getItem("Token");
    if (!token) return;

    try {
      const response = await Post.censorPost(token, postId.toString());
      if (response) {
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, is_censored: true } : post
        ));
      }
    } catch (error) {
      console.error("Erreur lors de la censure du post:", error);
    }
  };

  const handleUncensor = async (postId: number) => {
    const token = sessionStorage.getItem("Token");
    if (!token) return;

    try {
      const response = await Post.uncensorPost(token, postId.toString());
      if (response) {
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, is_censored: false } : post
        ));
      }
    } catch (error) {
      console.error("Erreur lors de la désensuration du post:", error);
    }
  };

  const handleDelete = async (postId: number) => {
    const token = sessionStorage.getItem("Token");
    if (!token) return;

    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
      try {
        const response = await Post.deletePost(token, postId.toString());
        if (response) {
          setPosts(posts.filter(post => post.id !== postId));
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du post:", error);
      }
    }
  };

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.user.pseudo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-500" />
        <Input
          placeholder="Rechercher un post..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-lg border shadow-sm">
        <div className="relative w-full overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr>
                <th className="text-foreground h-10 px-2 text-left align-middle font-medium">
                  Auteur
                </th>
                <th className="text-foreground h-10 px-2 text-left align-middle font-medium">
                  Contenu
                </th>
                <th className="text-foreground h-10 px-2 text-right align-middle font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="border-b transition-colors">
                  <td className="p-2 align-middle">
                    <div className="flex items-center space-x-2">
                      <img
                        src={post.user.avatar || "/public/profil/default.jpg"}
                        alt={post.user.pseudo}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="hidden md:inline">{post.user.pseudo}</span>
                    </div>
                  </td>
                  <td className="p-2 align-middle">
                    <div className="space-y-2">
                      <p className={`text-sm ${post.is_censored ? 'text-red-500 italic' : ''}`}>
                        {post.content}
                      </p>
                      {post.media && post.media.length > 0 && (
                        <div className="mt-2">
                          <ImageCarousel images={post.media} className="w-full max-w-md" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-2 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant={post.is_censored ? "default" : "destructive"}
                        size="default"
                        onClick={() => post.is_censored ? handleUncensor(post.id) : handleCensor(post.id)}
                        className="flex items-center gap-2"
                      >
                        {post.is_censored ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span className="hidden md:inline">Désensurer</span>
                          </>
                        ) : (
                          <>
                            <Ban className="h-4 w-4" />
                            <span className="hidden md:inline">Censurer</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="default"
                        onClick={() => handleDelete(post.id)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden md:inline">Supprimer</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {hasMorePages && (
          <div className="flex items-center justify-center px-4 py-2 border-t">
            <Button
              variant="outline"
              size="default"
              onClick={handleLoadMore}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Chargement..." : "Charger plus de posts"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 