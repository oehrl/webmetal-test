declare interface HTMLCanvasElement {
    getContext(contextId: "webmetal"): WebMetalRenderingContext;
}

declare class WebMetalRenderingContext {

    // -- Identification and feature detection

    readonly name: string;
    supportsFeatureSet(featureSet: WebMetalFeatureSet): boolean;

    // -- Library creation

    createLibrary(sourceCode: string): WebMetalLibrary;

    // -- Command queue creation

    createCommandQueue(): WebMetalCommandQueue;
    // @@ Do we need createCommandQueueWithMaxCommandBufferCount?

    // -- Resources

    createBuffer(data: ArrayBufferView): WebMetalBuffer;
    createTexture(descriptor: WebMetalTextureDescriptor): WebMetalTexture;
    createSamplerState(descriptor: WebMetalSamplerDescriptor): WebMetalSamplerState;

    // -- Rendering objects
    createDepthStencilState(descriptor: WebMetalDepthStencilDescriptor): WebMetalDepthStencilState;
    createRenderPipelineState(descriptor: WebMetalRenderPipelineDescriptor): WebMetalRenderPipelineState;
    // @@ Do we need the completion block versions?

    // -- Compute
    createComputePipelineState(f: WebMetalFunction): WebMetalComputePipelineState;
    createComputePipelineState(descriptor: WebMetalComputePipelineDescriptor): WebMetalComputePipelineState;

    // -- Getting the rendering destination
    nextDrawable(): WebMetalDrawable;
    // @@ Come up with a better way to do this.

    PixelFormatBGRA8Unorm: number;
    LoadActionClear: number;
    StoreActionStore: number;
    PrimitiveTypePoint: number;
}

declare class WebMetalCommandQueue {

    label: string;

    createCommandBuffer(): WebMetalCommandBuffer;
}

declare class WebMetalCommandBuffer {

    // -- Command Encoders
    createRenderCommandEncoderWithDescriptor(descriptor: WebMetalRenderPassDescriptor): WebMetalRenderCommandEncoder;
    createBlitCommandEncoder(): WebMetalBlitCommandEncoder;
    createComputeCommandEncoder(): WebMetalComputeCommandEncoder;

    // -- Status
    readonly status: WebMetalStatus;
    readonly error: string; // @@ need declare enum

    // - Execution

    commit(): void;
    presentDrawable(drawable: WebMetalDrawable): void;
    // readonly scheduled: Promise;
    // readonly completed: Promise;
    // @@ Should the completed promise be the return value of commit()?

    // @@ Maybe add enqueue or invent some way to offload filling the buffer
    // to workers?
}

declare class WebMetalDrawable {

    readonly texture: WebMetalTexture; // @@ Only the framebuffer should have this.

    present(): void;

}

declare class WebMetalCommandEncoder {

    readonly label: string;

    endEncoding(): void;

    // @@ Debugging helpers?
}

declare class WebMetalRenderCommandEncoder extends WebMetalCommandEncoder {

    // -- State

    // @@ Should these be s?
    setBlendColor(red: number, green: number, blue: number, alpha: number): void;
    setCullMode(mode: WebMetalCullMode): void;
    setDepthBias(bias: number, scale: number, clamp: number): void;
    setDepthClipMode(mode: WebMetalDepthClipMode): void;
    setDepthStencilState(depthStencilState: WebMetalDepthStencilState): void;
    setFrontFacingWinding(mode: WebMetalWinding): void;
    setRenderPipelineState(pipelineState: WebMetalRenderPipelineState): void;
    // @@ Use Geometry interfaces?
    setScissorRect(x: number, y: number, width: number, height: number): void;
    setStencilReferenceValue(value: number): void;
    // @@ Check if we can overload here
    setStencilReferenceValue(front: number, back: number): void;
    // setTriangleFillMode(mode: WebMetalTriangleFill): void;
    // setViewport(viewport: WebMetalViewportDictionary): void;
    setVisibilityResultMode(mode: WebMetalVisibilityResultMode, offset: number): void;

    // -- Resources

    setVertexBuffer(buffer: WebMetalBuffer, offset: number, index: number): void;
    setVertexBuffers(buffers: WebMetalBuffer[], offsets: number[], startIndex: number, count: number): void;
    // @@ need setVertexBytes?
    setVertexSamplerState(samplerState: WebMetalSamplerState, index: number): void;
    setVertexSamplerStates(samplerState: WebMetalSamplerState[], startIndex: number, count: number): void;
    setVertexTexture(texture: WebMetalTexture, index: number): void;
    setVertexTextures(textures: WebMetalTexture[], startIndex: number, count: number): void;

    setFragmentBuffer(buffer: WebMetalBuffer, offset: number, index: number): void;
    setFragmentBuffers(buffers: WebMetalBuffer[], offsets: number[], startIndex: number, count: number): void;
    // @@ need setFragmentBytes?
    setFragmentSamplerState(samplerState: WebMetalSamplerState, index: number): void;
    setFragmentSamplerStates(samplerState: WebMetalSamplerState[], startIndex: number, count: number): void;
    setFragmentTexture(texture: WebMetalTexture, index: number): void;
    setFragmentTextures(textures: WebMetalTexture[], startIndex: number, count: number): void;

    // -- Drawing

    drawPrimitives(type: number, start: number, count: number): void;
    // @@ add drawInstanced and drawIndexed

}

declare class WebMetalBlitCommandEncoder extends WebMetalCommandEncoder {
    // -- Copying Data Between Two Buffers
    copyFromBufferToBuffer(source: WebMetalBuffer, sourceOffset: number,
        destination: WebMetalBuffer, destinationOffset: number, size: number): void;

    // -- Copying Data From a Buffer to a Texture
    copyFromBufferToTexture(buffer: WebMetalBuffer, sourceOffset: number,
        sourceBytesPerRow: number,
        sourceBytesPerImage: number, size: WebMetalSize,
        texture: WebMetalTexture,
        destinationSlice: number, destinationLevel: number, origin: WebMetalOrigin): void;

    // -- Copying Data Between Two Textures
    copyFromTextureToTexture(): void;

    // -- Copying Data from a Texture to a Buffer
    copyFromTextureToBuffer(): void;

    // - Image Operations
    fillBuffer(buffer: WebMetalBuffer, start: number, count: number, value: number): void;
    generateMipmapsForTexture(): void;
}

declare class WebMetalComputeCommandEncoder extends WebMetalCommandEncoder {

    // - Specifying the Compute Pipeline State
    setComputePipelineState(state: WebMetalComputePipelineState): void;

    // -- Buffers and Textures
    setBuffer(buffer: WebMetalBuffer, offset: number, index: number): void;
    setBuffers(buffers: WebMetalBuffer[], offsets: number[], startIndex: number, count: number): void;

    setBuffer(bufferView: ArrayBufferView, index: number): void;

    setTexture(texture: WebMetalTexture, index: number): void;
    setTextures(textures: WebMetalTexture[], startIndex: number, count: number): void;

    setSamplerState(samplerState: WebMetalSamplerState, index: number): void;
    setSamplerStates(samplerStates: WebMetalSamplerState[], startIndex: number, count: number): void;

    // @@ do we need setThreadgroupMemoryLength?

    // -- Executing
    dispatch(threadgroupsPerGrid: WebMetalSize, threadsPerThreadgroup: WebMetalSize): void;
    // @@ dispatchThreadgroupsWithIndirectBuffer?
}

declare class WebMetalViewport {
    originX: number;
    originY: number;
    width: number;
    height: number;
    znear: number;
    zfar: number;
}


declare class WebMetalRenderPipelineDescriptor {

    label: string;

    vertexFunction: WebMetalFunction;
    // vertexDescriptor: WebMetalVertexDescriptor;
    fragmentFunction: WebMetalFunction;

    sampleCount: number;
    alphaToCoverageEnabled: boolean;
    alphaToOneEnabled: boolean;
    rasterizationEnabled: boolean;

    readonly colorAttachments: WebMetalRenderPipelineColorAttachmentDescriptor[];
    depthAttachmentPixelFormat: WebMetalPixelFormat;
    stencilAttachmentPixelFormat: WebMetalPixelFormat;

    reset(): void;

}

declare class WebMetalRenderPipelineState {
    label: string;
}


declare class WebMetalComputePipelineDescriptor {

    label: string;

    computeFunction: WebMetalFunction;
    threadGroupSizeIsMultipleOfThreadExecutionWidth: boolean;

    reset(): void;

}

declare class WebMetalComputePipelineState {
    maxTotalThreadsPerThreadgroup: number;
    threadExecutionWidth: number;
}


declare class WebMetalDepthStencilDescriptor {

    label: string;

    depthCompareFunction: WebMetalCompareFunction;
    depthWriteEnabled: boolean;

    backFaceStencil: WebMetalStencilDescriptor;
    frontFaceStencil: WebMetalStencilDescriptor;
}


declare class WebMetalStencilDescriptor {

    // -- Specifying Stencil Functions and Operations
    stencilFailureOperation: WebMetalStencilOperation;
    depthFailureOperation: WebMetalStencilOperation;
    depthStencilPassOperation: WebMetalStencilOperation;
    stencilCompareFunction: WebMetalCompareFunction;

    // -- Specifying Stencil Bit Mask Properties
    readMask: number;
    writeMask: number;
}

declare class WebMetalDepthStencilState {
    label: string;
}

declare class WebMetalSamplerDescriptor {
    rAddressMode: WebMetalSamplerAddressMode;
    sAddressMode: WebMetalSamplerAddressMode;
    tAddressMode: WebMetalSamplerAddressMode;
    minFilter: WebMetalSamplerMinMagFilter;
    magFilter: WebMetalSamplerMinMagFilter;
    mipFilter: WebMetalSamplerMipFilter;
    lodMinClamp: number;
    lodMaxClamp: number;
    lodAverage: boolean;
    maxAnisotropy: number;
    normalizedCoordinates: boolean;
    compareFunction: WebMetalCompareFunction;
    label: string;
}

declare class WebMetalSamplerState {
    label: string;
}

declare class WebMetalRenderPassAttachmentDescriptor {

    // -- Texture
    texture: WebMetalTexture;
    level: number;
    slice: number;
    depthPlane: number;

    // -- Rendering Pass Actions
    loadAction: WebMetalLoadAction;
    storeAction: WebMetalStoreAction;

    // -- Specifying the Texture to Resolve Multisample Data
    resolveTexture: WebMetalTexture;
    resolveLevel: number;
    resolveSlice: number;
    resolveDepthPlane: number;
}

declare class WebMetalRenderPassColorAttachmentDescriptor extends WebMetalRenderPassAttachmentDescriptor {

    clearColor: number[]; // @@ should color be a type?

}

declare class WebMetalRenderPassDepthAttachmentDescriptor extends WebMetalRenderPassAttachmentDescriptor {

    clearDepth: number;
    depthResolveFilter: WebMetalMultisampleDepthResolveFilter;

}

declare class WebMetalRenderPassStencilAttachmentDescriptor extends WebMetalRenderPassAttachmentDescriptor {

    clearStencil: number;

}

declare class WebMetalRenderPassDescriptor {

    readonly colorAttachments: WebMetalRenderPassColorAttachmentDescriptor[];
    depthAttachment: WebMetalRenderPassDepthAttachmentDescriptor;
    stencilAttachment: WebMetalRenderPassStencilAttachmentDescriptor;

    visibilityResultBuffer: WebMetalBuffer;

}

declare class WebMetalRenderPipelineColorAttachmentDescriptor {

    // -- Pipeline state
    pixelFormat: WebMetalPixelFormat;
    writeMask: WebMetalColorWriteMask;

    // -- Blending
    blendingEnabled: boolean;
    rgbBlendOperation: WebMetalBlendOperation;
    alphaBlendOperation: WebMetalBlendOperation;

    // -- Blend Factors
    sourceRGBBlendFactor: WebMetalBlendFactor;
    destinationRGBBlendFactor: WebMetalBlendFactor;
    sourceAlphaBlendFactor: WebMetalBlendFactor;
    destinationAlphaBlendFactor: WebMetalBlendFactor;
}

declare class WebMetalResource {
    readonly cpuCacheMode: WebMetalCPUCacheMode;
    readonly storageMode: WebMetalStorageMode;
    readonly label: string;

    setPurgeableState(state: string): void;
}

declare class WebMetalOrigin {
    x: number;
    y: number;
    z: number;
}

declare class WebMetalSize {
    width: number;
    height: number;
    depth: number;
}

declare class WebMetalRegion {
    origin: WebMetalOrigin;
    size: WebMetalSize;
}

declare class WebMetalTexture extends WebMetalResource {

    // @@ need API to provide data from <img>, <canvas>, <video> etc

    // -- Copying Data into a Texture Image
    replaceRegion(region: WebMetalRegion, mipmapLevel: number, slice: number,
        bytes: ArrayBufferView, bytesPerRow: number, bytesPerImage: number): void;
    replaceRegion(region: WebMetalRegion, mipmapLevel: number, bytes: ArrayBufferView, bytesPerRow: number): void;

    // -- Copying Data from a Texture Image
    getBytes(bytesPerRow: number, bytesPerImage: number, region: WebMetalRegion, mipmapLevel: number, slice: number): ArrayBufferView;

    // -- Creating Textures by Reusing Image Data
    // newTextureView(pixelFormat: string, textureType: string, levelRange: WebMetalRange, sliceRange: WebMetalRange): WebMetalTexture;

    // -- Querying Texture s
    readonly textureType: string;
    readonly pixelFormat: string;
    readonly width: number;
    readonly height: number;
    readonly depth: number;
    readonly mipmapLevelCount: number;
    readonly arrayLength: number;
    readonly sampleCount: number;
    readonly framebufferOnly: boolean;
    readonly rootResource: WebMetalResource;
    readonly usage: WebMetalTextureUsage;

    // -- Querying Parent Texture s
    readonly parentTexture: WebMetalTexture;
    readonly parentRelativeLevel: number;
    readonly parentRelativeSlice: number;

    // -- Querying Source Buffer s
    readonly buffer: WebMetalBuffer;
    readonly bufferOffset: number;
    readonly bufferBytesPerRow: number;
}


declare class WebMetalTextureDescriptor {
    textureType: string;
    pixelFormat: string;
    width: number;
    height: number;
    depth: number;
    mipmapLevelCount: number;
    sampleCount: number;
    arrayCount: number;
    resourceOptions: WebMetalResourceOptions;
    cpuCacheMode: WebMetalCPUCacheMode;
    storageMode: WebMetalStorageMode;
    usage: WebMetalTextureUsage;
}

declare class WebMetalBuffer extends WebMetalResource {

    createTexture(descriptor: WebMetalTextureDescriptor, offset: number, bytesPerRow: number): WebMetalTexture;

    readonly length: number;
    readonly contents: ArrayBufferView;

}

declare class WebMetalLibrary {

    readonly sourceCode: string;
    label: string;
    readonly functionNames: string[];

    functionWithName(name: string): WebMetalFunction;

}


declare class WebMetalFunction {

    readonly name: string;
    readonly functionType: WebMetalFunctionType;

    // readonly vertexs: WebMetalVertexs[];
}

declare enum WebMetalCompareFunction {
    "never",
    "less",
    "equal",
    "lessequal",
    "greater",
    "notequal",
    "greaterequal",
    "always"
}

declare enum WebMetalPixelFormat {
    "BGRA8Unorm",
    etc
}

declare enum WebMetalLoadAction {
    "dontcare",
    "load",
    "clear"
}

declare enum WebMetalStoreAction {
    "dontcare",
    "store",
    "multisampleresolve"
}

declare enum WebMetalPrimitiveType {
    "point",
    "line",
    "linestrip",
    "triangle",
    "trianglestrip"
}

declare enum WebMetalFunctionType {
    "fragment",
    "vertex"
}

declare enum WebMetalStencilOperation {
    "keep",
    "zero",
    "replace",
    "incrementclamp",
    "decrementclamp",
    "invert",
    "incrementwrap",
    "decrementwrap"
}

declare enum WebMetalStatus {
    "notenqueued",
    "enqueued",
    "committed",
    "scheduled",
    "completed",
    "error"
}

declare enum WebMetalSamplerAddressMode {
    "clamptoedge",
    "mirrorclamptoedge",
    "repeat",
    "mirrorrepeat",
    "clamptozero"
}

declare enum WebMetalSamplerMinMagFilter {
    "nearest",
    "linear"
}

declare enum WebMetalSamplerMipFilter {
    "notmipmapped",
    "nearest",
    "linear"
}

declare enum WebMetalCullMode {
    "none",
    "front",
    "back"
}

declare enum WebMetalIndexType {
    "uint16",
    "uint32"
}

declare enum WebMetalVisibilityResultMode {
    "disabled",
    "boolean",
    "counting"
}

declare enum WebMetalWinding {
    "clockwise",
    "counterclockwise"
}

declare enum WebMetalDepthClipMode {
    "clip",
    "clamp"
}

declare enum WebMetalTriangleFillMode {
    "fill",
    "lines"
}

declare enum WebMetalCPUCacheMode {
    "defaultcache",
    "writecombined"
}

declare enum WebMetalStorageMode {
    "shared",
    "managed",
    "private"
}

declare enum WebMetalResourceOptions {
    "cpucachemodedefaultcache",
    "cpucachemodewritecombined",
    "storagemodeshared",
    "storagemodemanaged",
    "storagemodeprivate",
    "optioncpucachemodedefaultcache",
    "optioncpucachemodewritecombined"
}

declare enum WebMetalTextureUsage {
    "unknown",
    "shaderread",
    "shaderwrite",
    "rendertarget",
    "pixelformatview"
}

declare enum WebMetalBlendOperation {
    "add",
    "subtract",
    "reversesubtract",
    "min",
    "max"
}

declare enum WebMetalBlendFactor {
    "zero",
    "one",
    "sourcecolor",
    "oneminussourcecolor",
    "sourcealpha",
    "oneminussourcealpha",
    "destinationcolor",
    "oneminusdestinationcolor",
    "destinationalpha",
    "oneminusdestinationalpha",
    "sourcealphasaturated",
    "blendcolor",
    "oneminusblendcolor",
    "blendalpha",
    "oneminusblendalpha",
}

declare enum WebMetalColorWriteMask {
    // This is mask: a, so the calling site
    // should take an array of them.
    "none",
    "red",
    "green",
    "blue",
    "alpha",
    "all"
}

declare enum WebMetalMultisampleDepthResolveFilter {
    "sample0",
    "min",
    "max"
}

declare enum WebMetalFeatureSet {
    // some names like...
    "level1",
    "level2"
}