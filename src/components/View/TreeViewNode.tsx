import { useEffect, useRef, useState } from "react";
import { TreeNodeDatum } from "react-d3-tree";
import { useDocumentation } from "./View";

const TreeViewNode = ({
  nodeDatum,
  toggleNode,
  handleMouseEnter,
  handleMouseLeave,
}: {
  nodeDatum: TreeNodeDatum;
  toggleNode: () => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { documentation, setDocumentation } = useDocumentation();

  useEffect(() => {
    if (!documentation.show) setIsFocused(false);
  }, [documentation.show]);

  return (
    <g className="view__tree__group">
      <g className="view__tree__group__container">
        <circle
          className={
            isFocused && documentation.show
              ? "view__tree__group__circle1 active"
              : "view__tree__group__circle1"
          }
          r="30"
          stroke="none"
        />
        <circle
          className="view__tree__group__circle2"
          r="15"
          onClick={() => {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            setDocumentation((prev) => {
              return { ...prev, show: false };
            });
            toggleNode();
          }}
          onMouseEnter={() => {
            hoverTimeoutRef.current = setTimeout(() => {
              setIsFocused(true);
            }, 300);
            handleMouseEnter();
          }}
          onMouseLeave={() => {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            handleMouseLeave();
          }}
        />
      </g>
      <text
        className="view__tree__group__text"
        fill="black"
        strokeWidth="1"
        x="20"
      >
        {nodeDatum.name}
      </text>
      {nodeDatum.attributes?.department && (
        <text
          className="view__tree__group__text"
          fill="black"
          x="20"
          y="20"
          strokeWidth="1"
        >
          Parameters: {nodeDatum.attributes?.department}
        </text>
      )}
    </g>
  );
};

export default TreeViewNode;
