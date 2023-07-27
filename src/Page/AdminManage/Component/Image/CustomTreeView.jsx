import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';

export default function CustomTreeView({ data, getLinkImage }) {
    const buildTree = (items) => {
        const tree = {};

        for (const item of items) {
            const [parentPath, folderAndFile] = item.split('/');
            const [folder, time] = folderAndFile.split('_');

            if (!tree[parentPath]) {
                tree[parentPath] = {};
            }

            if (!tree[parentPath][folder]) {
                tree[parentPath][folder] = [];
            }

            tree[parentPath][folder].push(time);
        }

        return tree;
    };

    const treeData = buildTree(data);
    const [expanded, setExpanded] = React.useState([]);
    const [selected, setSelected] = React.useState([]);
    const [selectedNode, setSelectedNode] = React.useState('');

    const handleGetLinkImage = (parentNode, childNode, time) => {
        setSelectedNode(parentNode + '/' + childNode + '_' + time)
        getLinkImage(parentNode + '/' + childNode + '_' + time)
    }

    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds);
    };

    const handleExpandClick = () => {
        setExpanded((oldExpanded) => (oldExpanded.length === 0 ? Object.keys(treeData) : []));
    };

    const handleSelectClick = () => {
        if (selected.length > 0) {
            getLinkImage("NOTFOUND/NOTFOUND.txt")
        }
        setExpanded([]);
        setSelected((oldSelected) => (oldSelected.length === 0 ? Object.keys(treeData) : []));
    };

    const renderTree = (nodes) => {
        return Object.keys(nodes).map((parentNode) => {
            const subNodes = nodes[parentNode];
            return (
                <TreeItem key={parentNode} nodeId={parentNode} label={parentNode}>
                    {Object.keys(subNodes).map((childNode) => (
                        <TreeItem key={childNode} nodeId={parentNode + '/' + childNode} label={childNode}>
                            {subNodes[childNode].map((time) => (
                                <TreeItem
                                    key={parentNode + '/' + childNode + '/' + time}
                                    nodeId={parentNode + '/' + childNode + '/' + time}
                                    label={time.replace(".txt", ".jpg")}
                                    onClick={() => handleGetLinkImage(parentNode,childNode,time)}
                                />
                            ))}
                        </TreeItem>
                    ))}
                </TreeItem>
            );
        });
    };

    return (
        <>
            <Button  style={{color: '#990000'}}
                     onClick={handleExpandClick}>
                {expanded.length === 0 ? 'Expand all' : 'Collapse all'}
            </Button>
            <Button  style={{color: '#990000'}}
                     onClick={handleSelectClick}>
                {selected.length === 0 ? 'Select all' : 'Unselect all'}
            </Button>
            <Box sx={{ height: "70vh", flexGrow: 1, width: "100%", overflowY: 'auto' }}>
                <TreeView
                    aria-label="controlled"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    expanded={expanded}
                    selected={selected}
                    onNodeToggle={handleToggle}
                    onNodeSelect={handleSelect}
                    multiSelect
                >
                    {renderTree(treeData)}
                </TreeView>
            </Box>
        </>
    );
}
