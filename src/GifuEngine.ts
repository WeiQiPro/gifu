import GobanEngine from "./component/GobanEngine.ts";
import SGFAdapter from "./component/SGFAdapter.ts";
import UploadDBEngine from "./component/UploadDBEngine.ts";
import ZobristEngine from "./component/ZobristEngine.ts";

class GifuEngine {
  private ZobristEngine: ZobristEngine;
  private GobanEngine: GobanEngine;
  private SGFAdapter: SGFAdapter;
  private UploadDBEngine: UploadDBEngine;

  constructor(){
    this.ZobristEngine = new ZobristEngine();
    this.GobanEngine = new GobanEngine();
    this.SGFAdapter = new SGFAdapter();
    this.UploadDBEngine = new UploadDBEngine();
  }

}

export default GifuEngine