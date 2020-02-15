// I regret using TS for this project, it doesn't work well with the DOM
// Or maybe I suck, whatever
//@ts-nocheck
class CoincidencePupper {
  private timer: number;
  public observer: MutationObserver;

  constructor() {
    this.timer = 0;
    this.observer = new MutationObserver(() => this.taskRunner());
  }

  public treeFilter() {}

  public textNodesUnder() {
    var walk = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node: any) {
          return node.nodeValue.trim() !== "" &&
            node.parentNode.nodeName !== "SCRIPT" &&
            node.parentNode.nodeName !== "STYLE" &&
            node.parentNode.nodeName !== "META" &&
            node.parentNode.nodeName !== "INPUT" &&
            node.parentNode.nodeName !== "FORM" &&
            node.parentNode.nodeName !== "TEXTAREA" &&
            node.parentNode.isContentEditable !== true


            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      },
      false
    );

    while (walk.nextNode()) {
      let tempNode = walk.currentNode;
      let tempText = tempNode.nodeValue?.split(" ");
      let newText: any = [];
      const toIterate = Array.isArray(tempText)
        ? () => {
            for (let iterator = 0; iterator < tempText.length; iterator += 1) {
              if (
                // to upper case will kill case sensitivity, I'd like to keep it
                aBunchOfCoincidences.indexOf(tempText[iterator]) !== -1
              ) {
                newText.push(`(((${tempText[iterator]})))`);
              } else {
                newText.push(tempText[iterator]);
              }
            }
          }
        : () => {
            if (aBunchOfCoincidences.indexOf(tempText) !== -1) {
              newText.push(`(((${tempText})))`);
            } else {
              newText.push(newText);
            }
          };
          toIterate();
          tempNode.nodeValue = newText.join(" ");
    }

  }

  public taskRunner = () => {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.textNodesUnder();
    }, 100);
  };
}
