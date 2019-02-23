import { assert, expect } from 'chai';
import 'mocha';
import { Index } from '../lib/index';
import { Series } from '../lib/series';
import { DataFrame } from '../lib/dataframe';

describe('Series merge', () => {

	it('can merge series', function () {

		const series1 = new Series([0, 1, 2]);
		const series2 = new Series([10, 11, 12]);
        const merged = series1.merge(series2, (a, b) => a + b);

		expect(merged.toPairs()).to.eql([
			[0, 0+10],
			[1, 1+11],
			[2, 2+12],
		]);
	});

	it('when merging series, undefined values in first series are skipped', function () {

		const series1 = new Series([undefined, 1, undefined]);
		const series2 = new Series([10, 11, 12]);
        const merged = series1.merge(series2, (a, b) => a + b);

		expect(merged.toPairs()).to.eql([
			[1, 1+11],
		]);
	});

	it('when merging series, undefined values in second series are skipped', function () {

		const series1 = new Series([0, 1, 2]);
		const series2 = new Series([10, undefined, undefined]);
        const merged = series1.merge(series2, (a, b) => a + b);

		expect(merged.toPairs()).to.eql([
			[0, 0+10],
		]);
	});
    
	it('can merge series with mismatched indicies', function () {

		const series1 = new Series({
            index: [4, 5, 6],
            values: [1, 2, 3]
        });
		const series2 = new Series({
            index: [5, 6, 7],
            values: [10, 11, 12]
        });
        const merged = series1.merge(series2, (a, b) => a + b);

		expect(merged.toPairs()).to.eql([
			[5, 2 + 10],
			[6, 3 + 11],
		]);
	});

	it('can merge empty series', function () {

		const series1 = new Series();
		const series2 = new Series();
        const merged = series1.merge(series2, (a, b) => a + b);
        expect(merged.toPairs()).to.eql([]);
    });
    
	it('can merge two series when second series is empty', function () {

		const series1 = new Series([0, 1, 2]);
		const series2 = new Series();
        const merged = series1.merge(series2, (a, b) => a + b);

		expect(merged.toPairs()).to.eql([]);
	});

	it('can merge two series when first series is empty', function () {

		const series1 = new Series();
		const series2 = new Series([10, 11, 12]);
        const merged = series1.merge(series2, (a, b) => a + b);

		expect(merged.toPairs()).to.eql([]);
	});

});