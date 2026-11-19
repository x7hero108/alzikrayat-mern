import { useState } from 'react';
import { api, errorMessages } from '../api.js';

// Props: photoId and onCommentAdded(newComment) so the parent can update the list immediately
function CommentForm({ photoId, onCommentAdded }) {
  const [text, setText] = useState('');
  const [errors, setErrors] = useState([]);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);
    setSending(true);

    try {
      const newComment = await api.addComment(photoId, text);
      onCommentAdded(newComment);
      setText('');
    } catch (err) {
      setErrors(errorMessages(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <div className="alert alert-danger">
          {errors.map((message) => (
            <div key={message}>{message}</div>
          ))}
        </div>
      )}

      <div className="mb-3">
        <label className="form-label" htmlFor="commentText">
          Add a comment
        </label>
        <textarea
          id="commentText"
          className="form-control"
          rows="3"
          maxLength="1000"
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={sending}>
        {sending ? 'Sending...' : 'Add Comment'}
      </button>
    </form>
  );
}

export default CommentForm;
