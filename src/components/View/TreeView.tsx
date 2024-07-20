import Tree, { TreeNodeDatum } from "react-d3-tree";
import { useEffect, useRef, useState, useMemo } from "react";
import { MdCenterFocusWeak } from "react-icons/md";
import { BiExpand } from "react-icons/bi";
import { BiCollapse } from "react-icons/bi";
import { Tooltip } from "react-tooltip";
import TreeViewNode from "./TreeViewNode";

const TreeView = ({
  handleMouseEnter,
  handleMouseLeave,
}: {
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}) => {
  const orgChart = {
    name: "for",
    children: [
      {
        name: "def",
        attributes: {
          department: "numpy",
        },
        children: [
          {
            name: "import",
            attributes: {
              department: "array",
            },
            children: [
              {
                name: "range",
              },
              {
                name: "range",
              },
              {
                name: "range",
              },
            ],
          },
          {
            name: "from",
            attributes: {
              department: "numpy",
            },
            children: [
              {
                name: "zeros",
              },
            ],
          },
        ],
      },
    ],
  };

  const [collapse, setCollapse] = useState(false);

  const [treeTranslate, setTreeTranslate] = useState({ x: 0, y: 0 });
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const [triggerRecenter, setTriggerRecenter] = useState(0);

  const recenterTree = () => {
    if (treeContainerRef.current) {
      const dimensions = treeContainerRef.current.getBoundingClientRect();
      setTreeTranslate({
        x: dimensions.width / 2,
        y: dimensions.height / 4,
      });
      setTriggerRecenter((prev) => prev + 1); // Force rerender
    }
  };

  useEffect(() => {
    if (treeContainerRef.current) {
      recenterTree();
    }
  }, []);

  const renderCustomNode = (
    {
      nodeDatum,
      toggleNode,
    }: {
      nodeDatum: TreeNodeDatum;
      toggleNode: () => void;
    },
    handleMouseEnter: () => void,
    handleMouseLeave: () => void
  ) => (
    <TreeViewNode
      nodeDatum={nodeDatum}
      toggleNode={toggleNode}
      handleMouseEnter={handleMouseEnter}
      handleMouseLeave={handleMouseLeave}
    />
  );

  const TreeMemo = useMemo(() => {
    return (
      <Tree
        key={triggerRecenter}
        data={orgChart}
        translate={treeTranslate}
        initialDepth={collapse ? 0 : undefined}
        dimensions={
          treeContainerRef.current
            ? {
                height: treeContainerRef.current.getBoundingClientRect().height,
                width: treeContainerRef.current.getBoundingClientRect().width,
              }
            : undefined
        }
        renderCustomNodeElement={(rd3tProps) =>
          renderCustomNode({ ...rd3tProps }, handleMouseEnter, handleMouseLeave)
        }
        orientation="vertical"
      />
    );
  }, [treeTranslate, triggerRecenter, collapse]);

  return (
    <div className="view__tree" ref={treeContainerRef}>
      <div className="view__tree__options">
        <Tooltip id="options-tooltip" />
        <div
          data-tooltip-id="options-tooltip"
          data-tooltip-content="Collapse tree"
          className="view__tree__options__icon first"
          onClick={() => {
            setCollapse(true);
            setTriggerRecenter((prevState) => prevState + 1);
          }}
        >
          <BiCollapse className="view__tree__options__icon__svg" />
        </div>
        <div
          data-tooltip-id="options-tooltip"
          data-tooltip-content="Expand tree"
          className="view__tree__options__icon"
          onClick={() => {
            setCollapse(false);
            setTriggerRecenter((prevState) => prevState + 1);
          }}
        >
          <BiExpand className="view__tree__options__icon__svg" />
        </div>
        <div
          data-tooltip-id="options-tooltip"
          data-tooltip-content="Recenter tree (current depth)"
          className="view__tree__options__icon"
          onClick={recenterTree}
        >
          <MdCenterFocusWeak className="view__tree__options__icon__svg" />
        </div>
      </div>
      {TreeMemo}
    </div>
  );
};

export default TreeView;
