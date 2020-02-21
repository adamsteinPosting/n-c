class CoincidenceDetector {
  private observer: MutationObserver;
  private mutationList: Array<Node> = [];
  private mutationTimer: number = 0;
  private mutationTimeoutSeconds: number = 0.1;

  constructor() {
    this.observer = new MutationObserver(this.mutationTasks);
    this.runObserver();
    this.parseNode(document.body);
  }

  private parseNode(target: Node) {
    // TreeWalker allows us to efficiently iterate the DOM
    const walk = document.createTreeWalker(
      target,
      NodeFilter.SHOW_TEXT,
      {
        // filters out nodes that cannot contain relevant portions of the DOM
        acceptNode: (node: any) => {
          return node.parentNode.nodeName !== "SCRIPT" &&
            node.parentNode.nodeName !== "STYLE" &&
            node.parentNode.nodeName !== "META" &&
            node.parentNode.nodeName !== "INPUT" &&
            node.parentNode.nodeName !== "FORM" &&
            node.parentNode.nodeName !== "TEXTAREA" &&
            node.parentNode.isContentEditable !== true &&
            node.nodeValue.trim().length > 3 &&
            // prevent re-iteration for mutations
            !node.nodeValue.includes("(((")
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      },
      false
    );

    // the actual iteration over the DOM parsed by the TreeWalker
    while (walk.nextNode()) {
      let nodePointer: Node = walk.currentNode;

      // coincidencePupperCompiledTrie is appended to the window object from compiledTrie.js
      // this is one of the easier, dirtier ways to handle modules in extensions
      // $1 represents the string captured by the regular expression
      nodePointer.nodeValue = nodePointer.nodeValue!.replace(
        coincidencePupperCompiledTrie,
        "(((" + "$1" + ")))"
      );
    }
  }

  private runObserver() {
    this.observer.observe(document.body, {
      childList: true, // observe direct children
      subtree: true
    });
  }

  // this function maintains a record of which nodes have changed during the mutation response timeout
  private mutationRecord(mutations: any) {
    for (let mutation of mutations) {
      for (let nodes of mutation.addedNodes) {
          this.mutationList.push(nodes);
      }
    }
  }

  private mutationTasks = (mutations: MutationRecord[]) => {
    this.mutationRecord(mutations);

    if (this.mutationTimer) clearTimeout(this.mutationTimer);
    this.mutationTimer = setTimeout(() => {
      for (let node of this.mutationList) {
        this.parseNode(node);
      }
      // reset the list of mutated nodes when we are finished parsing them
      this.mutationList = [];
    }, this.mutationTimeoutSeconds * 1000);
  };
}
// class end

// I'm putting the instantiation of the class here because es6 modules are not easy to use in chrome extensions
// and I see no reason to worry about the pollution of our class object here
// this may change if more features are added to the code
const coincidenceDetector = new CoincidenceDetector();
