!function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";var n=function(){function e(e,t){this.maxParticles=t,this.spawnRate=1e4,this.particlesToSpawn=0;var r=new Float32Array(8*t);this.vertexBuffer=e.createBuffer(r)}return e.prototype.update=function(e){var t=new Float32Array(this.vertexBuffer.contents);this.particlesToSpawn+=e*this.spawnRate;for(var r=0;r<this.maxParticles;++r){var n=t[8*r+3]-e;if(n>0){for(var i=0;i<3;++i)t[8*r+i]+=t[8*r+4+i]*e;t[8*r+3]=n}else if(this.particlesToSpawn>1){for(i=0;i<3;++i)t[8*r+i]=0;var a=void 0;do{a=0;for(i=0;i<3;++i){var o=2*Math.random()-1;t[8*r+4+i]=.2*o,a+=o*o}}while(a>1);t[8*r+3]=1+Math.random(),--this.particlesToSpawn}}},e.prototype.draw=function(){},e}(),i=function(){function e(e){this.app=e;var t=e.library.functionWithName("particle_vertex_main"),r=e.library.functionWithName("fragment_main");this.emitter=new n(e.gpu,1e3);var i=new WebMetalRenderPipelineDescriptor;i.vertexFunction=t,i.fragmentFunction=r,i.colorAttachments[0].pixelFormat=e.gpu.PixelFormatBGRA8Unorm,this.renderPipelineState=e.gpu.createRenderPipelineState(i),this.renderPassDescriptor=new WebMetalRenderPassDescriptor,this.renderPassDescriptor.colorAttachments[0].loadAction=e.gpu.LoadActionClear,this.renderPassDescriptor.colorAttachments[0].storeAction=e.gpu.StoreActionStore,this.renderPassDescriptor.colorAttachments[0].clearColor=[.35,.65,.85,1]}return e.prototype.update=function(){this.emitter.update(.03333)},e.prototype.render=function(){CanvasRenderingContext2D;var e=this.app.commandQueue.createCommandBuffer(),t=this.app.gpu.nextDrawable();this.renderPassDescriptor.colorAttachments[0].texture=t.texture;var r=e.createRenderCommandEncoderWithDescriptor(this.renderPassDescriptor);r.setRenderPipelineState(this.renderPipelineState),r.setVertexBuffer(this.emitter.vertexBuffer,0,0),r.drawPrimitives(this.app.gpu.PrimitiveTypePoint,0,this.emitter.maxParticles),r.endEncoding(),e.presentDrawable(t),e.commit()},e}(),a=function(){function e(e){if(this.canvas=e,this.lastTick=0,this.gpu=e.getContext("webmetal"),!this.gpu)throw new Error("Failed to create webmetal context");this.commandQueue=this.gpu.createCommandQueue(),this.library=this.gpu.createLibrary(document.getElementById("library").text),this.particleRenderPass=new i(this),this.lastTick=Date.now(),setInterval(this.update.bind(this),1e3/30),this.render()}return e.prototype.update=function(){var e=Date.now();this.lastTick;this.lastTick=e,this.particleRenderPass.update()},e.prototype.render=function(){this.particleRenderPass.render(),requestAnimationFrame(this.render.bind(this))},e}();window.onload=function(){new a(document.getElementById("canvas"))}}]);
//# sourceMappingURL=index.js.map