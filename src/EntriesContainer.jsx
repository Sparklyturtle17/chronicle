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

    console.log(item.comments);

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
      const functionUrl = import.meta.env.VITE_COMMENT_API_URL;
      console.log(functionUrl, JSON.stringify({ name, email, comment, entry: item.title }));
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, comment, entry: item.title }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }
      const result = await response.json();
      if (result.success) {
        alert(`Comment submitted for approval!`);
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

  console.log(item);
  console.log(item.alt);

  return (
    <div className="entry-item overflow-x-scroll">
      <div>
        <div>
          <h2 className="entry-title" id={item.title}>{item.title}</h2>
          <span className="entry-date">{item.prettyDate}</span>
        </div>
        <hr />
      </div>

      <div className="entry-body flex flex-col md:flex-row md:items-start md:gap-6 overflow-x-scroll">
          <aside
            className="entry-media mt-4 md:mt-0 md:w-96 flex-shrink-0 grow overflow-y-auto"
            style={
              textHeight
                ? { height: `${textHeight}px`, maxHeight: `${textHeight}px` }
                : undefined
            }
          >


            <div ref={textRef} className="entry-text flex-1">
              <div dangerouslySetInnerHTML={{ __html: item.text }} />
            </div>
          </aside>



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
              {item.media.map((mediaItem, idx) => (
                <div
                  key={idx}
                  className="media-frame overflow-hidden rounded border border-gray-300 bg-gray-50"
                >
                  <div dangerouslySetInnerHTML={{ __html: mediaItem.html }} />
                  {mediaItem.alt && <p><i>{mediaItem.alt}</i></p>}
                </div>
              ))}
            </div>
          </aside>
        )}
          <aside
            className="entry-media mt-4 md:mt-0 md:w-96 flex-shrink-0 overflow-y-auto"
            style={
              textHeight
                ? { height: `${textHeight}px`, maxHeight: `${textHeight}px` }
                : undefined
            }
          >
          <div>
            <h3>Comments</h3>
            {comments.sort((a, b) => new Date(a.date) - new Date(b.date)).map((c, idx) => (
              <div key={idx}>
                <hr />
                <strong>{c.name} ~</strong><br/>{c.comment}  <br/><i>~ on {new Date(c.date).toLocaleDateString()}</i>
              </div>
            ))}
          </div>
          <form className="media-frame p-4 rounded border border-gray-300 bg-gray-50 mb-4" onSubmit={handleSubmit}>
            <div>
              <label>Name:</label><br></br>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border border-gray-300 rounded-sm m-1"
              />
            </div>
            <div>
              <label>Email Address:</label><br></br>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-200 rounded-sm m-1"
              />
            </div>
            <div>
              <label>Comment:</label><br></br>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="border border-gray-300 rounded-sm m-1 p-1"
              />
            </div>
            <button className="malawiFlag text-white font-bold p-1 rounded" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Comment'}
            </button>
          </form>
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
