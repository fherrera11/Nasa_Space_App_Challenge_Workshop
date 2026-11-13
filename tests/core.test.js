import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { latestPoints, inBox, selectRecords, safeURL } from '../application/core.js';
test('inclusive bounds and antimeridian', () => {
  const b = {west:170,east:-170,south:-10,north:10};
  assert.ok(inBox([180,0],b)); assert.ok(inBox([-175,10],b));
  assert.ok(!inBox([0,0],b)); assert.ok(!inBox([175,11],b));
  assert.ok(inBox([-130,15],{west:-130,east:-60,south:15,north:60}));
});
test('latest valid point, unsupported geometry and combined filters', () => {
  const {records,skipped} = latestPoints([{id:'a',categories:[{id:'wildfires'}],geometry:[
    {type:'Point',coordinates:[0,0],date:'2020-01-01'},
    {type:'Point',coordinates:[10,20],date:'2021-01-01'},
    {type:'Point',coordinates:[999,0],date:'2022-01-01'}]},
    {id:'b',geometry:[{type:'Polygon',coordinates:[],date:'2020-01-01'}]}]);
  assert.equal(skipped,1); assert.deepEqual(records[0].point.coordinates,[10,20]);
  assert.equal(selectRecords(records,'wildfires',{west:0,east:10,south:0,north:20}).length,1);
  assert.equal(selectRecords(records,'volcanoes',null).length,0);
});
test('sample is usable and links reject executable schemes', () => {
  const data = JSON.parse(readFileSync(new URL('../sample-data/eonet-snapshot.json',import.meta.url)));
  assert.ok(latestPoints(data.events).records.length > 0);
  assert.equal(safeURL('javascript:alert(1)'),null);
  assert.equal(safeURL('https://example.org'),'https://example.org/');
});
