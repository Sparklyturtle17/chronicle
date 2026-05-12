import { useLayoutEffect, useRef, useState } from 'react';

function EntryItem({ item, comments }) {
  const textRef = useRef(null);
  const [textHeight, setTextHeight] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    if (!textRef.current) return;

    const syncHeight = () => {
      const height = Math.round(textRef.current.getBoundingClientRect().height);
      setTextHeight(height);
    };

    syncHeight();

    const resizeObserver = new ResizeObserver(syncHeight);
    resizeObserver.observe(textRef.current);

    const mutationObserver = new MutationObserver(syncHeight);
    mutationObserver.observe(textRef.current, { childList: true, subtree: true });

    window.addEventListener('resize', syncHeight);
    return () => {
      window.removeEventListener('resize', syncHeight);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [item.text, item.media.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !comment) {
      alert('Please fill name and comment');
      return;
    }
    setLoading(true);
    try {
      const functionUrl = '/.netlify/functions/submit-comment';
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, comment, entrySlug: item.title }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }
      const result = await response.json();
      if (result.success) {
        alert(`Comment submitted! PR: ${result.prUrl}`);
        setName('');
        setEmail('');
        setComment('');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting comment: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="entry-item">
      <div>
        <div>
          <h2 className="entry-title" id={item.title}>{item.title}</h2>
          <span className="entry-date">{item.prettyDate}</span>
        </div>
        <hr />
      </div>

      <div className="entry-body flex flex-col md:flex-row md:items-start md:gap-6">
        <div ref={textRef} className="entry-text flex-1">
          <div dangerouslySetInnerHTML={{ __html: item.text }} />
        </div>

        {item.media.length > 0 && (
          <aside
            className="entry-media mt-4 md:mt-0 md:w-96 flex-shrink-0 overflow-y-auto"
            style={
              textHeight
                ? { height: `${textHeight}px`, maxHeight: `${textHeight}px` }
                : undefined
            }
          >
            <div className="space-y-4">
              {item.media.map((html, idx) => (
                <div
                  key={idx}
                  className="media-frame overflow-hidden rounded border border-gray-300 bg-gray-50"
                >
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                </div>
              ))}
            </div>
          </aside>
        )}
        <aside>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Email (optional):</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label>Comment:</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Comment'}
            </button>
          </form>
          <div>
            <h3>Comments</h3>
            {comments.map((c, idx) => (
              <div key={idx}>
                <strong>{c.name}</strong> on {new Date(c.date).toLocaleDateString()}: {c.comment}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function EntriesContainer({ entriesItems, comments }) {
  return (
    <div className="w-full">
      {entriesItems.map((item) => (
        <EntryItem key={item.path} item={item} comments={comments.filter(c => c.entry === item.title)} />
      ))}
    </div>
  );
}
