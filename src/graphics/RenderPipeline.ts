import { RenderStage } from "./RenderStage";

export class RenderPipeline {
  private renderStages: RenderStage[] = [];
  readonly gpu: WebMetalRenderingContext;
  readonly commandQueue: WebMetalCommandQueue;
  readonly library: WebMetalLibrary;

  constructor(readonly canvas: HTMLCanvasElement, librarySource: string) {
    this.gpu = canvas.getContext("webmetal");
    this.commandQueue = this.gpu.createCommandQueue();
    this.library = this.gpu.createLibrary(librarySource);
  }

  addRenderStage(renderStage: RenderStage) {
    if (this.getRenderStage(renderStage.name) !== undefined) {
      throw new Error(`The render pipeline already contains the render stage '${renderStage.name}'`);
    }
    this.renderStages.push(renderStage);
  }

  getRenderStage(name: string) {
    for (const renderStage of this.renderStages) {
      if (renderStage.name === name) {
        return renderStage;
      }
    }
    return undefined;
  }

  render() {
    for (const renderStage of this.renderStages) {
      renderStage.render();
    }
  }
}