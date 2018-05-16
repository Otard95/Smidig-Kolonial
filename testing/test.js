function test_func () {
	console.log(arguments.callee);
}

test_func();