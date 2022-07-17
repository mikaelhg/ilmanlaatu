
FMI_WFS_SERVICE = 'https://opendata.fmi.fi/wfs'


def get_node_text(node):
    nodelist = node.childNodes
    result = []
    for node in nodelist:
        if node.nodeType == node.TEXT_NODE:
            result.append(node.data)
    return ''.join(result)
