

jQuery(document).ready(function ($) {
    
     const actionUrl =url="https://jsonplaceholder.typicode.com/todos/1";
    const data = [
        { id: 56, parentId: 62, label: "menu item 56", action: actionUrl },
        { id: 81, parentId: 80, label: "menu item 81", action: actionUrl },
        { id: 74, parentId: null, label: "menu item 74", action: actionUrl },
        { id: 76, parentId: 80, label: "menu item 76", action: actionUrl },
        { id: 63, parentId: 62, label: "menu item 63", action: actionUrl },
        { id: 80, parentId: 86, label: "menu item 80", action: actionUrl },
        { id: 62, parentId: 74, label: "menu item 62", action: actionUrl },
        { id: 86, parentId: 74, label: "menu item 86", action: actionUrl },
    ];

    ///////////////////////////////
    // Convert menu list to tree
    // https://typeofnan.dev/an-easy-way-to-build-a-tree-with-object-references/
    function convertListToTree(data) {

        let root = [];
        const idMapping = data.reduce((acc, el, i) => {
            acc[el.id] = i;
            return acc;
        }, {});
        data.forEach(el => {
            // Handle the root element
            if (el.parentId === null) {
                root.push(el);
                // return;
            } else {
                // Use our mapping to locate the parent element in our data array
                const parentEl = data[idMapping[el.parentId]];
                // Add our current el to its parent's `children` array
                parentEl.children = [...(parentEl.children || []), el];
            }
        });
        return root;
    }
    let root = convertListToTree(data);
    /////////////////////////////////////////////

    /// build the menu from tree 
    function buildList(tree, target) {

        var parentDiv = document.createElement('div');
        for (var node in tree) {
            //prepare the container menu
            var div = document.createElement('div');
            div.setAttribute("class", "container");

            //if the menu item has children menu items
            if (tree[node].children != undefined) {
                let labelDiv = document.createElement('div');
                labelDiv.setAttribute("class", "btn");
                labelDiv.appendChild(document.createTextNode(tree[node].label));
                let childrenDiv = document.createElement('div');
                div.appendChild(labelDiv);
                div.appendChild(childrenDiv);
                //recursive calling
                buildList(tree[node].children, childrenDiv);
                $(childrenDiv).slideToggle('slow');
                //toggle collapsing 
                labelDiv.addEventListener('click', function () {
                   $(childrenDiv).slideToggle('slow');
                });
            // If the menu item is a leaf 
            } else {
                const nodeLabel = tree[node].label;
                const nodeAction = tree[node].action;
                var div = document.createElement('div');
                var divlink = document.createElement('a');
                divlink.setAttribute("href", "#");
                divlink.addEventListener('click', function () {
                    doAjax(nodeAction);
                });
                divlink.appendChild(document.createTextNode(nodeLabel));
                div.appendChild(divlink);
            }
            parentDiv.appendChild(div);
        }
        target.appendChild(parentDiv);
    }

    //call service
    function doAjax(url) {
       
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: function (response) {
                alert(response.title);
            }

        });
    }
    buildList(root, document.getElementById("accordion"));
});