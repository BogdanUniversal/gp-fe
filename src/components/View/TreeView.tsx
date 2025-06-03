import Tree, { TreeNodeDatum, RawNodeDatum } from "react-d3-tree";
import { useEffect, useRef, useState, useMemo, useContext } from "react";
import { MdCenterFocusWeak } from "react-icons/md";
import { BiExpand } from "react-icons/bi";
import { BiCollapse } from "react-icons/bi";
import TreeViewNode from "./TreeViewNode";
import { Tooltip } from "@mui/material";
import { ModelContext } from "../Model/ModelContext";
import { api } from "../../User/api";
import Loader from "../Loader/Loader";

const TreeView = () => {
  const { model, setModel } = useContext(ModelContext);
  const [orgChart, setOrgChart] = useState<any>({
    name: "Select model first!",
    children: [],
  });
  const [loading, setLoading] = useState<boolean>(false);

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
      setTriggerRecenter((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (treeContainerRef.current) {
      recenterTree();
    }
    setLoading(true);
    api
      .get("/models/get_tree", {
        params: { model_id: model?.id },
        withCredentials: true,
      })
      .then((response) => {
        setOrgChart(response.data as RawNodeDatum);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tree:", error);
        setLoading(false);
      });
  }, []);

  const renderCustomNode = ({
    nodeDatum,
    toggleNode,
  }: {
    nodeDatum: TreeNodeDatum;
    toggleNode: () => void;
  }) => <TreeViewNode nodeDatum={nodeDatum} toggleNode={toggleNode} />;

  const TreeMemo = useMemo(() => {
    return (
      <Tree
        key={triggerRecenter}
        data={orgChart}
        translate={treeTranslate}
        initialDepth={collapse ? 0 : undefined}
        separation={{ siblings: 2, nonSiblings: 2.5 }}
        dimensions={
          treeContainerRef.current
            ? {
                height: treeContainerRef.current.getBoundingClientRect().height,
                width: treeContainerRef.current.getBoundingClientRect().width,
              }
            : undefined
        }
        renderCustomNodeElement={(rd3tProps) =>
          renderCustomNode({ ...rd3tProps })
        }
        orientation="vertical"
      />
    );
  }, [treeTranslate, triggerRecenter, collapse, orgChart]);

  return (
    <div className="view__tree" ref={treeContainerRef}>
      <div className="view__tree__options">
        <Tooltip
          title={
            <span className="view__tree__options__tooltip">Collapse Tree</span>
          }
          arrow
        >
          <div
            className="view__tree__options__icon first"
            onClick={() => {
              setCollapse(true);
              setTriggerRecenter((prevState) => prevState + 1);
            }}
          >
            <BiCollapse className="view__tree__options__icon__svg" />
          </div>
        </Tooltip>
        <Tooltip
          title={
            <span className="view__tree__options__tooltip">Expand Tree</span>
          }
          arrow
        >
          <div
            className="view__tree__options__icon"
            onClick={() => {
              setCollapse(false);
              setTriggerRecenter((prevState) => prevState + 1);
            }}
          >
            <BiExpand className="view__tree__options__icon__svg" />
          </div>
        </Tooltip>
        <Tooltip
          title={
            <span className="view__tree__options__tooltip">Center Tree</span>
          }
          arrow
        >
          <div className="view__tree__options__icon" onClick={recenterTree}>
            <MdCenterFocusWeak className="view__tree__options__icon__svg" />
          </div>
        </Tooltip>
      </div>
      {loading ? (
        <div className="view__tree__loader">
          <Loader />
        </div>
      ) : (
        TreeMemo
      )}
    </div>
  );
};

export default TreeView;
