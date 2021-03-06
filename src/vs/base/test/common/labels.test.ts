/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import * as assert from 'assert';
import labels = require('vs/base/common/labels');
import platform = require('vs/base/common/platform');

suite('Labels', () => {
	test('shorten - windows', () => {
		if (!platform.isWindows) {
			assert.ok(true);
			return;
		}

		// nothing to shorten
		assert.deepEqual(labels.shorten(['a']), ['a']);
		assert.deepEqual(labels.shorten(['a', 'b']), ['a', 'b']);
		assert.deepEqual(labels.shorten(['a', 'b', 'c']), ['a', 'b', 'c']);

		// completely different paths
		assert.deepEqual(labels.shorten(['a\\b', 'c\\d', 'e\\f']), ['…\\b', '…\\d', '…\\f']);

		// same beginning
		assert.deepEqual(labels.shorten(['a', 'a\\b']), ['a', '…\\b']);
		assert.deepEqual(labels.shorten(['a\\b', 'a\\b\\c']), ['…\\b', '…\\c']);
		assert.deepEqual(labels.shorten(['a', 'a\\b', 'a\\b\\c']), ['a', '…\\b', '…\\c']);
		assert.deepEqual(labels.shorten(['x:\\a\\b', 'x:\\a\\c']), ['…\\b', '…\\c'], 'TODO: drive letter (or schema) should be preserved');
		assert.deepEqual(labels.shorten(['\\\\a\\b', '\\\\a\\c']), ['…\\b', '…\\c'], 'TODO: root uri should be preserved');

		// same ending
		assert.deepEqual(labels.shorten(['a', 'b\\a']), ['a', 'b\\…']);
		assert.deepEqual(labels.shorten(['a\\b\\c', 'd\\b\\c']), ['a\\…', 'd\\…']);
		assert.deepEqual(labels.shorten(['a\\b\\c\\d', 'f\\b\\c\\d']), ['a\\…', 'f\\…']);
		assert.deepEqual(labels.shorten(['d\\e\\a\\b\\c', 'd\\b\\c']), ['…\\a\\…', 'd\\b\\…']);
		assert.deepEqual(labels.shorten(['a\\b\\c\\d', 'a\\f\\b\\c\\d']), ['a\\b\\…', '…\\f\\…']);
		assert.deepEqual(labels.shorten(['a\\b\\a', 'b\\b\\a']), ['a\\b\\…', 'b\\b\\…']);
		assert.deepEqual(labels.shorten(['d\\f\\a\\b\\c', 'h\\d\\b\\c']), ['…\\a\\…', 'h\\…']);
		assert.deepEqual(labels.shorten(['a\\b\\c', 'x:\\0\\a\\b\\c']), ['a\\b\\c', '…\\0\\…'], 'TODO: drive letter (or schema) should be always preserved');
		assert.deepEqual(labels.shorten(['x:\\a\\b', 'y:\\a\\b']), ['x:\\…', 'y:\\…']);
		assert.deepEqual(labels.shorten(['\\\\x\\b', '\\\\y\\b']), ['…\\x\\…', '…\\y\\…'], 'TODO: \\\\x instead of …\\x');

		// same in the middle
		assert.deepEqual(labels.shorten(['a\\b\\c', 'd\\b\\e']), ['…\\c', '…\\e']);

		// case-sensetive
		assert.deepEqual(labels.shorten(['a\\b\\c', 'd\\b\\C']), ['…\\c', '…\\C']);

		assert.deepEqual(labels.shorten(['a', 'a\\b', 'a\\b\\c', 'd\\b\\c', 'd\\b']), ['a', 'a\\b', 'a\\b\\c', 'd\\b\\c', 'd\\b']);
		assert.deepEqual(labels.shorten(['a', 'a\\b', 'b']), ['a', 'a\\b', 'b']);
		assert.deepEqual(labels.shorten(['', 'a', 'b', 'b\\c', 'a\\c']), ['', 'a', 'b', 'b\\c', 'a\\c']);
		assert.deepEqual(labels.shorten(['src\\vs\\workbench\\parts\\execution\\electron-browser', 'src\\vs\\workbench\\parts\\execution\\electron-browser\\something', 'src\\vs\\workbench\\parts\\terminal\\electron-browser']), ['…\\execution\\electron-browser', '…\\something', '…\\terminal\\…']);
	});

	test('shorten - not windows', () => {
		if (platform.isWindows) {
			assert.ok(true);
			return;
		}

		// nothing to shorten
		assert.deepEqual(labels.shorten(['a']), ['a']);
		assert.deepEqual(labels.shorten(['a', 'b']), ['a', 'b']);
		assert.deepEqual(labels.shorten(['a', 'b', 'c']), ['a', 'b', 'c']);

		// completely different paths
		assert.deepEqual(labels.shorten(['a/b', 'c/d', 'e/f']), ['…/b', '…/d', '…/f']);

		// same beginning
		assert.deepEqual(labels.shorten(['a', 'a/b']), ['a', '…/b']);
		assert.deepEqual(labels.shorten(['a/b', 'a/b/c']), ['…/b', '…/c']);
		assert.deepEqual(labels.shorten(['a', 'a/b', 'a/b/c']), ['a', '…/b', '…/c']);
		assert.deepEqual(labels.shorten(['x:/a/b', 'x:/a/c']), ['…/b', '…/c'], 'TODO: drive letter (or schema) should be preserved');
		assert.deepEqual(labels.shorten(['//a/b', '//a/c']), ['…/b', '…/c'], 'TODO: root uri should be preserved');

		// same ending
		assert.deepEqual(labels.shorten(['a', 'b/a']), ['a', 'b/…']);
		assert.deepEqual(labels.shorten(['a/b/c', 'd/b/c']), ['a/…', 'd/…']);
		assert.deepEqual(labels.shorten(['a/b/c/d', 'f/b/c/d']), ['a/…', 'f/…']);
		assert.deepEqual(labels.shorten(['d/e/a/b/c', 'd/b/c']), ['…/a/…', 'd/b/…']);
		assert.deepEqual(labels.shorten(['a/b/c/d', 'a/f/b/c/d']), ['a/b/…', '…/f/…']);
		assert.deepEqual(labels.shorten(['a/b/a', 'b/b/a']), ['a/b/…', 'b/b/…']);
		assert.deepEqual(labels.shorten(['d/f/a/b/c', 'h/d/b/c']), ['…/a/…', 'h/…']);
		assert.deepEqual(labels.shorten(['a/b/c', 'x:/0/a/b/c']), ['a/b/c', '…/0/…'], 'TODO: drive letter (or schema) should be always preserved');
		assert.deepEqual(labels.shorten(['x:/a/b', 'y:/a/b']), ['x:/…', 'y:/…']);
		assert.deepEqual(labels.shorten(['//x/b', '//y/b']), ['…/x/…', '…/y/…'], 'TODO: //x instead of …/x');

		// same in the middle
		assert.deepEqual(labels.shorten(['a/b/c', 'd/b/e']), ['…/c', '…/e']);

		// case-sensitive
		assert.deepEqual(labels.shorten(['a/b/c', 'd/b/C']), ['…/c', '…/C']);

		assert.deepEqual(labels.shorten(['a', 'a/b', 'a/b/c', 'd/b/c', 'd/b']), ['a', 'a/b', 'a/b/c', 'd/b/c', 'd/b']);
		assert.deepEqual(labels.shorten(['a', 'a/b', 'b']), ['a', 'a/b', 'b']);
		assert.deepEqual(labels.shorten(['', 'a', 'b', 'b/c', 'a/c']), ['', 'a', 'b', 'b/c', 'a/c']);
	});

	test('template', function () {

		// simple
		assert.strictEqual(labels.template('Foo Bar'), 'Foo Bar');
		assert.strictEqual(labels.template('Foo${}Bar'), 'FooBar');
		assert.strictEqual(labels.template('$FooBar'), '');
		assert.strictEqual(labels.template('}FooBar'), '}FooBar');
		assert.strictEqual(labels.template('Foo ${one} Bar', { one: 'value' }), 'Foo value Bar');
		assert.strictEqual(labels.template('Foo ${one} Bar ${two}', { one: 'value', two: 'other value' }), 'Foo value Bar other value');

		// conditional separator
		assert.strictEqual(labels.template('Foo${separator}Bar'), 'FooBar');
		assert.strictEqual(labels.template('Foo${separator}Bar', { separator: { label: ' - ' } }), 'FooBar');
		assert.strictEqual(labels.template('${separator}Foo${separator}Bar', { value: 'something', separator: { label: ' - ' } }), 'FooBar');
		assert.strictEqual(labels.template('${value} Foo${separator}Bar', { value: 'something', separator: { label: ' - ' } }), 'something FooBar');

		// // real world example (macOS)
		let t = '${activeEditorName}${separator}${rootName}';
		assert.strictEqual(labels.template(t, { activeEditorName: '', rootName: '', separator: { label: ' - ' } }), '');
		assert.strictEqual(labels.template(t, { activeEditorName: '', rootName: 'root', separator: { label: ' - ' } }), 'root');
		assert.strictEqual(labels.template(t, { activeEditorName: 'markdown.txt', rootName: 'root', separator: { label: ' - ' } }), 'markdown.txt - root');

		// // real world example (other)
		t = '${dirty}${activeEditorName}${separator}${rootName}${separator}${appName}';
		assert.strictEqual(labels.template(t, { dirty: '', activeEditorName: '', rootName: '', appName: '', separator: { label: ' - ' } }), '');
		assert.strictEqual(labels.template(t, { dirty: '', activeEditorName: '', rootName: '', appName: 'Visual Studio Code', separator: { label: ' - ' } }), 'Visual Studio Code');
		assert.strictEqual(labels.template(t, { dirty: '', activeEditorName: 'Untitled-1', rootName: '', appName: 'Visual Studio Code', separator: { label: ' - ' } }), 'Untitled-1 - Visual Studio Code');
		assert.strictEqual(labels.template(t, { dirty: '', activeEditorName: '', rootName: 'monaco', appName: 'Visual Studio Code', separator: { label: ' - ' } }), 'monaco - Visual Studio Code');
		assert.strictEqual(labels.template(t, { dirty: '', activeEditorName: 'somefile.txt', rootName: 'monaco', appName: 'Visual Studio Code', separator: { label: ' - ' } }), 'somefile.txt - monaco - Visual Studio Code');
		assert.strictEqual(labels.template(t, { dirty: '* ', activeEditorName: 'somefile.txt', rootName: 'monaco', appName: 'Visual Studio Code', separator: { label: ' - ' } }), '* somefile.txt - monaco - Visual Studio Code');
	});
});