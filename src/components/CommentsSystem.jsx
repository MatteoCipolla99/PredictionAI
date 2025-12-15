import { useState } from "react";
import { MessageSquare } from "lucide-react";

const CommentsSystem = ({ matchId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [tags, setTags] = useState([]);
  const availableTags = ["Value", "Risk", "Info", "Alert", "Strategy"];

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

  const toggleTag = (tag) => {
    setTags(
      tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="font-bold">Note e Commenti</h3>
      </div>

      <div className="bg-surface border border-primary/30 rounded-xl p-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Aggiungi una nota..."
          className="w-full px-3 py-2 bg-surface-light border border-primary/30 rounded-lg focus:outline-none focus:border-primary resize-none"
          rows="3"
        />
        <div className="flex flex-wrap gap-2 mt-2 mb-3">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-2 py-1 rounded text-xs ${
                tags.includes(tag)
                  ? "bg-primary text-white"
                  : "bg-surface-light text-muted hover:bg-surface"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
        <button
          onClick={addComment}
          className="w-full py-2 bg-gradient-to-r from-primary to-accent rounded-lg hover:opacity-90 transition-all"
        >
          Aggiungi Nota
        </button>
      </div>

      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-surface border border-primary/30 rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex flex-wrap gap-1">
                {comment.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-primary/20 text-primary rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="text-xs text-muted">
                {new Date(comment.date).toLocaleString()}
              </div>
            </div>
            <p className="text-sm">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSystem;
