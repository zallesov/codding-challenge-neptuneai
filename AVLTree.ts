export class TreeNode<T> {
    key: T;
    height: number;
    left: TreeNode<T> | null;
    right: TreeNode<T> | null;

    constructor(key: T) {
        this.key = key;
        this.height = 1; // New node is initially added at leaf
        this.left = null;
        this.right = null;
    }
}

export class AVLTree<T> {
    root: TreeNode<T> | null;

    constructor() {
        this.root = null;
    }

    // Get the height of the node
    getHeight(node: TreeNode<T> | null): number {
        return node ? node.height : 0;
    }

    // Get the balance factor of the node
    getBalance(node: TreeNode<T> | null): number {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }

    // Right rotate the subtree rooted with y
    rightRotate(y: TreeNode<T>): TreeNode<T> {
        const x = y.left!;
        const T2 = x.right;

        // Perform rotation
        x.right = y;
        y.left = T2;

        // Update heights
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

        // Return new root
        return x;
    }

    // Left rotate the subtree rooted with x
    leftRotate(x: TreeNode<T>): TreeNode<T> {
        const y = x.right!;
        const T2 = y.left;

        // Perform rotation
        y.left = x;
        x.right = T2;

        // Update heights
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

        // Return new root
        return y;
    }

    // Insert a key into the subtree rooted with node
    insert(node: TreeNode<T> | null, key: T): TreeNode<T> {
        // Perform the normal BST insert
        if (!node) return new TreeNode(key);

        if (key < node.key) {
            node.left = this.insert(node.left, key);
        } else if (key > node.key) {
            node.right = this.insert(node.right, key);
        } else {
            return node; // Duplicate keys are not allowed
        }

        // Update the height of this ancestor node
        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

        // Get the balance factor of this ancestor node to check whether
        // this node became unbalanced
        const balance = this.getBalance(node);

        // If this node becomes unbalanced, then there are 4 cases

        // Left Left Case
        if (balance > 1 && key < (node.left!.key)) {
            return this.rightRotate(node);
        }

        // Right Right Case
        if (balance < -1 && key > (node.right!.key)) {
            return this.leftRotate(node);
        }

        // Left Right Case
        if (balance > 1 && key > (node.left!.key)) {
            node.left = this.leftRotate(node.left!);
            return this.rightRotate(node);
        }

        // Right Left Case
        if (balance < -1 && key < (node.right!.key)) {
            node.right = this.rightRotate(node.right!);
            return this.leftRotate(node);
        }

        // Return the (unchanged) node pointer
        return node;
    }

    // Public method to insert a key
    public insertKey(key: T): void {
        this.root = this.insert(this.root, key);
    }

    public remove(node: TreeNode<T> | null, key: T): TreeNode<T> | null {
        // Perform standard BST delete
        if (!node) return null; // Base case: node not found

        if (key < node.key) {
            node.left = this.remove(node.left, key);
        } else if (key > node.key) {
            node.right = this.remove(node.right, key);
        } else {
            // Node with only one child or no child
            if (!node.left) return node.right;
            else if (!node.right) return node.left;

            // Node with two children: Get the inorder successor (smallest in the right subtree)
            const temp = this.findMinNode(node.right);
            if (temp) { // Check if temp is not null
                node.key = temp.key; // Copy the inorder successor's content to this node
                node.right = this.remove(node.right, temp.key); // Delete the inorder successor
            }
        }

        // Update the height of the current node
        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

        // Get the balance factor of this ancestor node to check whether
        // this node became unbalanced
        const balance = this.getBalance(node);

        // If this node becomes unbalanced, then there are 4 cases

        // Left Left Case
        if (balance > 1 && this.getBalance(node.left) >= 0) {
            return this.rightRotate(node);
        }

        // Left Right Case
        if (balance > 1 && this.getBalance(node.left) < 0) {
            node.left = this.leftRotate(node.left!);
            return this.rightRotate(node);
        }

        // Right Right Case
        if (balance < -1 && this.getBalance(node.right) <= 0) {
            return this.leftRotate(node);
        }

        // Right Left Case
        if (balance < -1 && this.getBalance(node.right) > 0) {
            node.right = this.rightRotate(node.right!);
            return this.leftRotate(node);
        }

        // Return the (unchanged) node pointer
        return node;
    }

    // Helper method to find the node with the minimum key
    private findMinNode(node: TreeNode<T> | null): TreeNode<T> | null {
        if (!node || !node.left) return node;
        return this.findMinNode(node.left);
    }

    // Public method to remove a key
    public removeKey(key: T): void {
        this.root = this.remove(this.root, key);
    }

    // In-order traversal of the tree
    inOrder(node: TreeNode<T> | null): void {
        if (node) {
            this.inOrder(node.left);
            console.log(node.key);
            this.inOrder(node.right);
        }
    }

    // Public method to perform in-order traversal
    public inOrderTraversal(): void {
        this.inOrder(this.root);
    }

    // Method to find the minimum value in the tree
    public findMin(): T | null {
        if (!this.root) return null; // Tree is empty
        let current = this.root;
        while (current.left) {
            current = current.left; // Go to the leftmost node
        }
        return current.key; // Return the minimum value
    }

    // Method to find the maximum value in the tree
    public findMax(): T | null {
        if (!this.root) return null; // Tree is empty
        let current = this.root;
        while (current.right) {
            current = current.right; // Go to the rightmost node
        }
        return current.key; // Return the maximum value
    }
}
