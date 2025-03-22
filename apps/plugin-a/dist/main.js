(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('obsidian')) :
  typeof define === 'function' && define.amd ? define(['obsidian'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.PluginA = factory(global.Obs));
})(this, (function (obsidian) { 'use strict';

  const n = (e) => e == null, s = (e) => e && typeof e == "object", r = (e) => n(e) || Array.isArray(e) && e.length === 0 || s(e) && Object.keys(e).length === 0 || typeof e == "string" && e.trim().length === 0;

  console.log('Entrou no app', r);
  class PluginA extends obsidian.Plugin {
      onload() {
          console.log('Carregou o PluginA', r(false));
      }
      unload() {
          console.log('Descarregou o PluginA', r(true));
      }
  }

  return PluginA;

}));
