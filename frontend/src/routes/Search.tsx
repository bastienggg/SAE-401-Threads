import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/ui/header';
import Navbar from '../components/Navbar/Navbar';
import { Post as PostAPI } from '../data/post';
import { User } from '../data/user';
import Post from '../components/Post/Post';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search as SearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

type SearchResult = {
  type: 'post' | 'user' | 'hashtag';
  data: any;
};

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'posts' | 'users' | 'hashtags'>('all');

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm) return;
      
      setLoading(true);
      try {
        const token = sessionStorage.getItem('Token');
        if (!token) return;

        // Recherche de posts
        const postsResponse = await PostAPI.searchPosts(token, searchTerm);
        const posts = (postsResponse?.posts || []).map((post: any) => ({
          type: 'post',
          data: post
        }));

        // Recherche d'utilisateurs
        const usersResponse = await User.searchUsers(token, searchTerm);
        const users = (usersResponse?.users || []).map((user: any) => ({
          type: 'user',
          data: user
        }));

        // Recherche de hashtags
        const hashtags = searchTerm.match(/#[\w\u0590-\u05ff]+/g) || [];
        const hashtagResults = hashtags.map(tag => ({
          type: 'hashtag',
          data: { tag }
        }));

        setResults([...posts, ...users, ...hashtagResults]);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      setSearchParams({ q: searchTerm });
    }
  };

  const filteredResults = results.filter(result => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'posts') return result.type === 'post';
    if (activeFilter === 'users') return result.type === 'user';
    if (activeFilter === 'hashtags') return result.type === 'hashtag';
    return true;
  });

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 p-4 max-w-4xl mx-auto w-full">
        <div className="mb-6">
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">
                <SearchIcon className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </form>
        </div>

        <div className="flex gap-4 mb-6 w-full justify-start flex-wrap">
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('all')}
          >
            Tout
          </Button>
          <Button
            variant={activeFilter === 'posts' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('posts')}
          >
            Posts
          </Button>
          <Button
            variant={activeFilter === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('users')}
          >
            Utilisateurs
          </Button>
          <Button
            variant={activeFilter === 'hashtags' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('hashtags')}
          >
            Hashtags
          </Button>
        </div>

        {loading ? (
          <div className="text-center">Chargement...</div>
        ) : filteredResults.length > 0 ? (
          <div className="space-y-4">
            {filteredResults.map((result, index) => {
              if (result.type === 'post') {
                return (
                  <Post
                    key={index}
                    content={result.data.content}
                    pseudo={result.data.user.pseudo}
                    createdAt={result.data.created_at}
                    avatar={result.data.user.avatar}
                    userId={result.data.user.id}
                    postId={result.data.id}
                    likeCount={result.data.like_count || 0}
                    userLiked={result.data.user_liked || false}
                    isBlocked={result.data.user.is_blocked || false}
                    hasBlockedMe={result.data.user.has_blocked_me || false}
                    media={result.data.media || []}
                    refreshPosts={() => {
                      // Rafraîchir les résultats de recherche
                      const token = sessionStorage.getItem('Token');
                      if (token) {
                        PostAPI.searchPosts(token, searchTerm).then(response => {
                          if (response?.posts) {
                            setResults(prev => [
                              ...prev.filter(r => r.type !== 'post'),
                              ...response.posts.map((post: any) => ({
                                type: 'post',
                                data: post
                              }))
                            ]);
                          }
                        });
                      }
                    }}
                  />
                );
              } else if (result.type === 'user') {
                return (
                  <Link 
                    key={index} 
                    to={`/profile/${result.data.id}`}
                    className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={result.data.avatar || '/public/profil/default.jpg'}
                      alt={`Avatar de ${result.data.pseudo}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{result.data.pseudo}</h3>
                      <p className="text-sm text-gray-500">{result.data.email}</p>
                    </div>
                  </Link>
                );
              } else {
                return (
                  <Link
                    key={index}
                    to={`/search?q=${encodeURIComponent(result.data.tag)}`}
                    className="block p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-blue-500">#{result.data.tag}</h3>
                  </Link>
                );
              }
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Aucun résultat trouvé pour "{searchTerm}"
          </div>
        )}
      </div>
      <Navbar onPostCreated={() => {}} />
    </main>
  );
} 