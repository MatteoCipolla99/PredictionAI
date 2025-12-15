import { useState, useEffect } from "react";
import { MessageSquare, Trash2, Tag } from "lucide-react";

const CommentsSystem = ({ matchId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [tags, setTags] = useState([]);
  const availableTags = ["Value", "Risk", "Info", "Alert", "Strategy"];

  // Carica commenti dal localStorage
  useEffect(() => {
    const savedComments = localStorage.getItem(`comments_${matchId}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, [matchId]);

  // Salva commenti nel localStorage
  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem(`comments_${matchId}`, JSON.stringify(comments));
    }
  }, [comments, matchId]);

  const addComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        text: newComment,
        tags: [...tags],
        date: new Date().toISOString(),
      };
      setComments([comment, ...comments]);
      setNewComment("");
      setTags([]);
    }
  };

  const deleteComment = (commentId) => {
    setComments(comments.filter((c) => c.id !== commentId));
  };

  const toggleTag = (tag) => {
    setTags(
      tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]
    );
  };

  const getTagColor = (tag) => {
    const colors = {
      Value: "bg-green-600/20 text-green-400 border-green-500/30",
      Risk: "bg-red-600/20 text-red-400 border-red-500/30",
      Info: "bg-blue-600/20 text-blue-400 border-blue-500/30",
      Alert: "bg-yellow-600/20 text-yellow-400 border-yellow-500/30",
      Strategy: "bg-purple-600/20 text-purple-400 border-purple-500/30",
    };
    return colors[tag] || "bg-slate-700 text-gray-400";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-blue-400" />
        <h4 className="font-bold">Note e Commenti</h4>
        <span className="text-xs text-gray-400">({comments.length})</span>
      </div>

      {/* Input Area */}
      <div className="bg-slate-900/50 border border-blue-800/30 rounded-lg p-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Aggiungi una nota personale per questa partita..."
          className="w-full px-3 py-2 bg-slate-800/50 border border-blue-700/30 rounded-lg focus:outline-none focus:border-blue-500 resize-none text-sm"
          rows="3"
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3 mb-3">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${
                tags.includes(tag)
                  ? getTagColor(tag)
                  : "bg-slate-800/50 text-gray-400 border-slate-700 hover:bg-slate-800"
              }`}
            >
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={addComment}
          disabled={!newComment.trim()}
          className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          Aggiungi Nota
        </button>
      </div>

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-slate-900/50 border border-blue-800/30 rounded-lg p-4 hover:border-blue-600/50 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex flex-wrap gap-2">
                  {comment.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-1 rounded text-xs font-medium border ${getTagColor(
                        tag
                      )}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-400">
                    {new Date(comment.date).toLocaleString("it-IT", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="p-1 hover:bg-red-600/20 text-red-400 rounded transition-all"
                    title="Elimina nota"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-200">{comment.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsSystem;
