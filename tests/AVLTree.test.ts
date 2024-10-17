import { AVLTree } from "../AVLTree.ts"; // Adjust the import path as necessary

Deno.test("AVL Tree Insertion and In-Order Traversal", () => {
    const avl = new AVLTree<number>();

    // Insert elements
    avl.insertKey(30);
    avl.insertKey(20);
    avl.insertKey(40);
    avl.insertKey(10);
    avl.insertKey(25);
    avl.insertKey(35);
    avl.insertKey(50);

    // Capture in-order traversal output
    const inOrderOutput: number[] = [];
    const originalInOrder = avl.inOrder.bind(avl);
    avl.inOrder = (node: any) => {
        if (node) {
            originalInOrder(node.left);
            inOrderOutput.push(node.key);
            originalInOrder(node.right);
        }
    };

    avl.inOrderTraversal();

    // Check if the in-order traversal is sorted
    const expectedOutput = [10, 20, 25, 30, 35, 40, 50];
    console.assert(JSON.stringify(inOrderOutput) === JSON.stringify(expectedOutput), "In-order traversal output is incorrect");
});

Deno.test("AVL Tree Balance Factor", () => {
    const avl = new AVLTree<number>();

    // Insert elements
    avl.insertKey(30);
    avl.insertKey(20);
    avl.insertKey(40);
    avl.insertKey(10);
    avl.insertKey(25);
    avl.insertKey(35);
    avl.insertKey(50);

    // Check balance factors
    const checkBalance = (node: any): boolean => {
        if (!node) return true;

        const balance = avl.getBalance(node);
        if (Math.abs(balance) > 1) {
            console.error(`Node with key ${node.key} is unbalanced with balance factor ${balance}`);
            return false;
        }

        return checkBalance(node.left) && checkBalance(node.right);
    };

    const isBalanced = checkBalance(avl.root);
    console.assert(isBalanced, "The AVL tree is not balanced");
});

Deno.test("AVL Tree Find Min and Max", () => {
    const avl = new AVLTree<number>();

    // Insert elements
    avl.insertKey(30);
    avl.insertKey(20);
    avl.insertKey(40);
    avl.insertKey(10);
    avl.insertKey(25);
    avl.insertKey(35);
    avl.insertKey(50);

    // Test findMin
    const minValue = avl.findMin();
    console.assert(minValue === 10, "Minimum value should be 10");

    // Test findMax
    const maxValue = avl.findMax();
    console.assert(maxValue === 50, "Maximum value should be 50");
});

Deno.test("AVL Tree Remove", () => {
    const avl = new AVLTree<number>();

    // Insert elements
    avl.insertKey(30);
    avl.insertKey(20);
    avl.insertKey(40);
    avl.insertKey(10);
    avl.insertKey(25);
    avl.insertKey(35);
    avl.insertKey(50);

    // Remove a leaf node
    avl.removeKey(10);
    console.assert(avl.findMin() === 20, "Minimum value should be 20 after removing 10");

    // Remove a node with one child
    avl.removeKey(20);
    console.assert(avl.findMin() === 25, "Minimum value should be 25 after removing 20");

    // Remove a node with two children
    avl.removeKey(30);
    console.assert(avl.findMin() === 25, "Minimum value should still be 25 after removing 30");
});
