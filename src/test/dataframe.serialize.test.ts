import { assert, expect } from 'chai';
import 'mocha';
import { Index } from '../lib/index';
import { DataFrame, IDataFrame } from '../lib/dataframe';
// @ts-ignore
import moment from "dayjs";
import { ISerializedDataFrame } from "@data-forge/serialization";

describe('DataFrame serialization', () => {

    it('can serialize empty dataframe', ()  => {

        const df = new DataFrame();
        expect(df.serialize()).to.eql({
            columnOrder: [],
            columns: {},
            index: {
                type: "empty",
                values: [],
            },
            values: [],
        });
    });

    it('can serialize dataframe with various types', ()  => {
        const df = new DataFrame({ 
            index: [10, 20, 30],
            columnNames: ["A", "B", "C"],
            rows: [
                [100, "a", true],
                [200, "b", false],
                [300, "c", false],
            ]
        });

        expect(df.serialize()).to.eql({
            columnOrder: ["A", "B", "C"],
            columns: {
                A: "number",
                B: "string",
                C: "boolean",
            },
            index: {
                type: "number",
                values: [10, 20, 30],
            },
            values: [
                { A: 100, B: "a", C: true },
                { A: 200, B: "b", C: false },
                { A: 300, B: "c", C: false },
            ]
        });
    });

    it('can serialize dataframe with dates', ()  => {
        const df = new DataFrame({ 
            index: [10],
            columnNames: ["A"],
            rows: [
                [moment("2018/05/15", "YYYY/MM/DD").toDate()],
            ]
        });

        expect(df.serialize()).to.eql({
            columnOrder: [ "A" ],
            columns: {
                A: "date",
            },
            index: {
                type: "number",
                values: [ 10, ],
            },
            values: [
                { 
                    A: moment("2018/05/15", "YYYY/MM/DD").toISOString() 
                },
            ]
        });
    });

    it ('can deserialize empty dataframe', () => {

        const df = DataFrame.deserialize({ columnOrder: [], columns: {}, index: { type: "number", values: [], }, values: [] });
        expect(df.count()).to.eql(0);
    });

    it ('can deserialize empty dataframe 2', () => {

        const df = DataFrame.deserialize({} as ISerializedDataFrame);
        expect(df.count()).to.eql(0);
    });
    
    it ('can deserialize dataframe with various types', () => {

        const df = DataFrame.deserialize({
            columnOrder: ["A", "B", "C"],
            columns: {
                A: "number",
                B: "string",
                C: "boolean",
            },
            index: {
                type: "number",
                values: [ 10, 20, 30 ],
            },
            values: [
                { A: 100, B: "a", C: true, },
                { A: 200, B: "b", C: false, },
                { A: 300, B: "c", C: false, },
            ]
        });
        
        expect(df.count()).to.eql(3);
        expect(df.getColumnNames()).to.eql(["A", "B", "C"]);
        expect(df.getIndex().toArray()).to.eql([10, 20, 30]);
        expect(df.toRows()).to.eql([
            [100, "a",  true],
            [200, "b", false],
            [300, "c", false],
        ]);
    });
   
    it ('can deserialize dataframe with dates', () => {

        const df = DataFrame.deserialize({
            columnOrder: [ "A" ],
            columns: {
                A: "date",
            },
            index: {
                type: "number",
                values: [ 10, ],
            },
            values: [
                { A: moment("2018/05/15", "YYYY/MM/DD").toISOString() },
            ]
        });
        
        expect(df.count()).to.eql(1);
        expect(df.getColumnNames()).to.eql(["A"]);
        expect(df.getIndex().toArray()).to.eql([10]);
        expect(df.toRows()).to.eql([
            [moment("2018/05/15", "YYYY/MM/DD").toDate()],
        ]);
    });

    it ('can serialize index with dates', () => {
        const df = new DataFrame({ 
            index: [moment("2018/05/15", "YYYY/MM/DD").toDate()],
            columnNames: ["A"],
            rows: [
                [ 1, ],
            ]
        });

        expect(df.serialize()).to.eql({
            columnOrder: [ "A" ],
            columns: {
                A: "number",            },
            index: {
                type: "date",
                values: [ moment("2018/05/15", "YYYY/MM/DD").toISOString(), ],
            },
            values: [
                { A: 1, },
            ]
        });

    });

    it ('can deserialize index with dates', () => {

        const df = DataFrame.deserialize({
            columnOrder: [ "A" ],
            columns: {
                A: "number",
            },
            index: {
                type: "date",
                values: [ moment("2018/05/15", "YYYY/MM/DD").toISOString(), ],
            },
            values: [
                { A: 10, },
            ]
        });
        
        expect(df.count()).to.eql(1);
        expect(df.getColumnNames()).to.eql([ "A" ]);
        expect(df.getIndex().toArray()).to.eql([moment("2018/05/15", "YYYY/MM/DD").toDate()]);
        expect(df.toRows()).to.eql([
            [10],
        ]);
    });
    
});