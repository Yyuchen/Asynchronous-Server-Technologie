"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var encoding_down_1 = __importDefault(require("encoding-down"));
var leveldown_1 = __importDefault(require("leveldown"));
var levelup_1 = __importDefault(require("levelup"));
class LevelDb{
    static open(path){
        const encoded = encoding_down_1.default(leveldown_1.default("path"),{valueEncoding:'json'});
        return leveldown_1.default(encoded);
    }
}

exports.LevelDb = LevelDb;
