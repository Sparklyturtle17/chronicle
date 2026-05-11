import { useLayoutEffect, useRef, useState } from 'react';

function EntryItem({ item }) {
  const textRef = useRef(null);
  const [textHeight, setTextHeight] = useState(0);

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
      </div>
    </div>
  );
}

export default function EntriesContainer({ entriesItems }) {
  return (
    <div className="w-full">
      {entriesItems.map((item) => (
        <EntryItem key={item.path} item={item} />
      ))}
    </div>
  );
}
