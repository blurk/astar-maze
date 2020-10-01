function AStarPathFinder(map, start, end, allowDiagonals) {
	this.map = map;
	this.lastCheckedNode = start; //keep track of previous node
	this.openSet = [];
	this.closedSet = [];
	// add start node to OPEN when initialing maze
	this.openSet.push(start);

	this.start = start; //[0][0] as default
	this.end = end; // [cols-1][rows- 1] as default

	this.allowDiagonals = allowDiagonals;

	/* Will return a measure of aesthetic preference for
	use when ordering the openSet. It is used to priorities
	between equal standard heuristic scores. 
	In conclusion: make the path look cool when allowDiagonals = true */

	this.visualDist = function (a, b) {
		return dist(a.i, a.j, b.i, b.j);
	};

	// function for implementing the smart of this algorithm: calculate distance of 2 points

	this.heuristic = function (a, b) {
		var d;
		if (allowDiagonals) {
			d = dist(a.i, a.j, b.i, b.j);
		} else {
			d = abs(a.i - b.i) + abs(a.j - b.j);
		}
		return d;
	};

	// Function to delete element from the array
	this.removeFromArray = function (arr, elt) {
		// Could use indexOf here instead to be more efficient
		for (var i = arr.length - 1; i >= 0; i--) {
			if (arr[i] == elt) {
				arr.splice(i, 1);
			}
		}
	};

	//Run one finding step.
	//returns 0 if search ongoing
	//returns 1 if goal reached
	//returns -1 if no solution
	this.step = function () {
		if (this.openSet.length > 0) {
			// Best next option
			var winner = 0;
			for (var i = 1; i < this.openSet.length; i++) {
				if (this.openSet[i].f < this.openSet[winner].f) {
					winner = i;
				}
				//if we have a tie according to the standard heuristic
				if (this.openSet[i].f == this.openSet[winner].f) {
					//Prefer to explore options with longer known paths (closer to goal)
					if (this.openSet[i].g > this.openSet[winner].g) {
						winner = i;
					}
					/* Using Manhattan distances then also break ties
					of the known distance measure by using the visual heuristic.
					This will make the route when allowDiagonals = true looks correct. && make no difference to the actual path's distance*/
					if (!this.allowDiagonals) {
						if (
							this.openSet[i].g == this.openSet[winner].g &&
							this.openSet[i].vh < this.openSet[winner].vh
						) {
							winner = i;
						}
					}
				}
			}
			var current = this.openSet[winner];
			this.lastCheckedNode = current;

			// If done
			if (current === this.end) {
				console.log('DONE!');
				return 1;
			}

			// Best option moves from openSet to closedSet
			this.removeFromArray(this.openSet, current);
			this.closedSet.push(current);

			// Check all the neighbors
			var neighbors = current.getNeighbors();

			for (var i = 0; i < neighbors.length; i++) {
				var neighbor = neighbors[i];

				// Valid next spot?
				if (!this.closedSet.includes(neighbor)) {
					// Is this a better path than before?
					var tempG = current.g + this.heuristic(neighbor, current);

					// Is this a better path than before?
					if (!this.openSet.includes(neighbor)) {
						this.openSet.push(neighbor);
					} else if (tempG >= neighbor.g) {
						// No, it's not a better path, get to next node
						continue;
					}

					//calculate cost function f(n)
					neighbor.g = tempG;
					neighbor.h = this.heuristic(neighbor, end);

					if (!allowDiagonals) {
						neighbor.vh = this.visualDist(neighbor, end);
					}
					neighbor.f = neighbor.g + neighbor.h;
					neighbor.previous = current;
				}
			}
			return 0;
			// Uh oh, no solution
		} else {
			console.log('no solution');
			return -1;
		}
	};
}
