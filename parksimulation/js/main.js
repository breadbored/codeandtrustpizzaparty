class Guest {
    // Float scale of 0.0 to 1.0, 0.0 == activities, 1.0 == Rides
    thrill;
    // Time in minutes that a person is willing to wait in line
    patience;

    headed_to_ride = null;
    current_ride = null;

    // Which step (simulated time) the person arrived
    arrived;

    pos = [0,0];

    constructor(arrived, thrill, patience) {
        this.arrived = arrived;
        this.thrill = thrill;
        this.patience = patience;
    }

    doneRiding() {
        this.headed_to_ride = null;
        this.current_ride = null;
    }

    nextStep(stepNum) {
        var move = false;
        if (this.current_ride === null && this.headed_to_ride === null) {
            if (Math.random() < this.thrill) {
                this.headed_to_ride = thrillingRides[Math.floor(Math.random() * thrillingRides.length)];
            } else {
                this.headed_to_ride = activities[Math.floor(Math.random() * activities.length)];
            }
            move = true;

            // if this ride's wait is too long, the guest needs to find another ride next step
            // if (this.headed_to_ride.getWaitTime() > this.patience) {
            //     this.headed_to_ride = null;
            //     move = false;
            // }
        } else if (this.current_ride === null && this.headed_to_ride !== null) {
            move = true;
        }

        if (move) {
            if (this.pos[0] == this.headed_to_ride.pos[0] && this.pos[1] == this.headed_to_ride.pos[1]) {
                if (this.headed_to_ride.getWaitTime() > this.patience) {
                    this.headed_to_ride = null;
                } else {
                    this.current_ride = this.headed_to_ride;
                    this.current_ride.queue.push(this);
                }
            } else {
                var xStep = 0;
                var yStep = 0;

                if (Math.abs(this.pos[0] - this.headed_to_ride.pos[0]) >= 10) {
                    xStep = 10;
                } else {
                    xStep = Math.abs(this.pos[0] - this.headed_to_ride.pos[0]);
                }

                if (Math.abs(this.pos[1] - this.headed_to_ride.pos[1]) >= 10) {
                    yStep = 10;
                } else {
                    yStep = Math.abs(this.pos[1] - this.headed_to_ride.pos[1]);
                }

                var xDirection = (this.pos[0] < this.headed_to_ride.pos[0]) ? 1 : -1;
                var yDirection = (this.pos[1] < this.headed_to_ride.pos[1]) ? 1 : -1;
                this.pos[0] += xStep * xDirection;
                this.pos[1] += yStep * yDirection;
            }
        }
    }
}

class Attraction {
    name;
    capacity;
    // Frequency in steps (simulated time) that the ride takes a load of passengers
    frequency;
    queue = [];
    downtime = 0.01;
    thrilling;

    pos = [0,0];

    constructor(name, capacity, frequency, thrilling, position) {
        this.name = name;
        this.capacity = capacity;
        this.frequency = frequency;
        this.thrilling = thrilling;
        this.pos = position;
    }

    getWaitTime() {
        return Math.ceil((this.queue.length / this.capacity) * this.frequency);
    }

    nextStep(stepNum) {
        if (stepNum % this.frequency == 0) {
            for (var i = 0; i < this.capacity; i++) {
                if (typeof this.queue[0] !== 'undefined') {
                    var guest = this.queue.shift();
                    guest.doneRiding()
                }
            }
        }
    }
}

const NUM_GUESTS = 15000
const MINUTES_IN_STEP = 5
const MAX_PATIENCE_MINUTES = 3 * 60
const ARRIVAL = {
    AM10: 0.0500,
    AM11: 0.2000,
    PM12: 0.4375,
    PM1 : 0.6175,
    PM2 : 0.8175,
    PM3 : 0.9175,
    PM4 : 0.9500,
    PM5 : 1.0000,
}

// Generated guests
var guests = Array(NUM_GUESTS).fill();
guests.forEach((e,i) => {
    var time = Math.random();
    var thrill = Math.random();
    var patience = Math.floor(
        Math.random() * (
            MAX_PATIENCE_MINUTES / MINUTES_IN_STEP
        )
    ) * 5 + 15
    
    if (time < ARRIVAL.AM10) {
        guests[i] = new Guest(
            (60 / MINUTES_IN_STEP) * 0,
            thrill,
            patience
        );
    } else if (time < ARRIVAL.AM11) {
        guests[i] = new Guest(
            (60 / MINUTES_IN_STEP) * 1,
            thrill,
            patience
        );
    } else  if (time < ARRIVAL.PM12) {
        guests[i] = new Guest(
            (60 / MINUTES_IN_STEP) * 2,
            thrill,
            patience
        );
    } else  if (time < ARRIVAL.PM1) {
        guests[i] = new Guest(
            (60 / MINUTES_IN_STEP) * 3,
            thrill,
            patience
        );
    } else  if (time < ARRIVAL.PM2) {
        guests[i] = new Guest(
            (60 / MINUTES_IN_STEP) * 4,
            thrill,
            patience
        );
    } else  if (time < ARRIVAL.PM3) {
        guests[i] = new Guest(
            (60 / MINUTES_IN_STEP) * 5,
            thrill,
            patience
        );
    } else  if (time < ARRIVAL.PM4) {
        guests[i] = new Guest(
            (60 / MINUTES_IN_STEP) * 6,
            thrill,
            patience
        );
    } else  if (time < ARRIVAL.PM5) {
        guests[i] = new Guest(
            (60 / MINUTES_IN_STEP) * 7,
            thrill,
            patience
        );
    } else {
        guests[i] = new Guest(
            (60 / MINUTES_IN_STEP) * 8,
            thrill,
            patience
        );
    }
});
guests = _.sortBy(guests, ['arrived']);
var guestsInPark = [];

// Rides
// Triangle is fast paced go-karts
const TRIANGLE = new Attraction("Triangle", 12, 6, true, [20, 90]);
// Square is a fast paced rollercoaster
const SQUARE = new Attraction("Square", 12, 6, true, [50,100]);
// Pentagon is a US Department of Defence themed propaganda attraction
const PENTAGON = new Attraction("Pentagon", 30, 10, false, [ 0, 50]);
// Hexagon is a meet and greet with the 6 elders of hell
const HEXAGON = new Attraction("Hexagon", 5, 1, false, [10, 80]);
// Septagon is a sewage themed children's ride
const SEPTAGON = new Attraction("Septagon", 12, 8, false, [80, 90]);
// Octagon is a giant, spinning octopus ride
const OCTAGON = new Attraction("Octagon", 8, 2, true, [90, 80]);
// Nonagon is a boring ride that makes you say, "No, Nah"
const NONAGON = new Attraction("Nonagon", 6, 2, false, [100,50]);
// Polygon is an extreme, multi-sided rollercoaster
const POLYGON = new Attraction("Polygon", 24, 8, true, [50,70]);


var rides = [
    // TRIANGLE,
    // SQUARE,
    // PENTAGON,
    // HEXAGON,
    // SEPTAGON,
    // OCTAGON,
    // NONAGON,
    // POLYGON,
];

var magicKingdomData = [
    {
        name: "its a small world",
        capacity: 2000,
        thrill: false
    },
    {
        name: "Big Thunder Mountain Railroad",
        capacity: 1400,
        thrill: true
    },
    {
        name: "Dumbo the Flying Elephant",
        capacity: 1200,
        thrill: true
    },
    {
        name: "Liberty Square Riverboat",
        capacity: 900,
        thrill: true
    },
    {
        name: "Mad Tea Party",
        capacity: 950,
        thrill: false
    },
    {
        name: "Peter Pans Flight",
        capacity: 1100,
        thrill: false
    },
    {
        name: "Prince Charming Regal Carrousel",
        capacity: 850,
        thrill: false
    },
    {
        name: "Space Mountain",
        capacity: 2000,
        thrill: true
    },
    {
        name: "Splash Mountain",
        capacity: 1800,
        thrill: true
    },
    {
        name: "The Haunted Mansion",
        capacity: 2400,
        thrill: false
    },
    {
        name: "The Many Adventures of Winnie the Pooh",
        capacity: 700,
        thrill: false
    },
    {
        name: "Tomorrowland Transit Authority Peoplemover",
        capacity: 3600,
        thrill: true
    },
    {
        name: "Under the Sea: Journey of the Little Mermaid",
        capacity: 1900,
        thrill: true
    },
    {
        name: "Walt Disneys Carousel of Progress",
        capacity: 3600,
        thrill: true
    }
]

for (var i = 0; i < magicKingdomData.length; i++) {
    rides.push(
        new Attraction(
            magicKingdomData[i].name,
            Math.round(magicKingdomData[i].capacity / (60 / MINUTES_IN_STEP)),
            12,
            magicKingdomData[i].thrill,
            [
                Math.round(Math.random() * 100),
                Math.round(Math.random() * 100),
            ]
        )
    )
}

var thrillingRides = _.filter(rides, (r) => {
    return r.thrilling
});
var activities = _.filter(rides, (r) => {
    return !r.thrilling
});

var currentStep = 0;
var historicalData = [];
const takeStep = (skipUpdateView) => {
    rides.forEach((e,i) => {
        e.nextStep(currentStep);
    });
    guestsInPark.forEach((e,i) => {
        e.nextStep(currentStep);
    });
    guests.forEach((e,i) => {
        if (e.arrived == currentStep) {
            guestsInPark.push(e);
        }
    });

    currentStep++;

    if (typeof skipUpdateView === 'undefined' || !skipUpdateView) {
        updateView();
    }
}

const multiStep = (num) => {
    for (var z = 0; z < num; z++) {
        takeStep(true);
    }
    updateView();
}

const updateView = () => {
    $('.step_count').text(currentStep);
    $('.ride_log').html(getAttractionTableUpdate());
}

const getAttractionTableUpdate = () => {
    var newTable = "<table>";

    newTable = newTable + `\
    <tr>\
        <th>Name</th>\
        <th>Queue Length</th>\
        <th>Capacity</th>\
        <th>Frequency</th>\
        <th>Wait Time</th>\
        <th>Thrilling?</th>\
        <th>Pos</th>\
    </tr>`;

    for (var i = 0; i < rides.length; i++) {
        var ride = rides[i];
        newTable = newTable + `\
        <tr>\
            <td>${ride.name}</td>\
            <td>${ride.queue.length}</td>\
            <td>${ride.capacity}</td>\
            <td>${ride.frequency}</td>\
            <td>${ride.getWaitTime()}</td>\
            <td>${ride.thrilling}</td>\
            <td>${ride.pos[0]}, ${ride.pos[1]}</td>\
        </tr>`;
    }

    var lookingAround = _.filter(guestsInPark, (guest) => {
        return guest.headed_to_ride === null
    });
    var walkingToRide = _.filter(guestsInPark, (guest) => {
        return guest.current_ride === null && guest.headed_to_ride !== null
    });
    newTable = newTable + `\
    <tr>\
        <td>Looking Around</td>\
        <td>${lookingAround.length}</td>\
    </tr>\
    <tr>\
        <td>Walking to Ride</td>\
        <td>${walkingToRide.length}</td>\
    </tr>`;

    newTable = newTable + "</table>";

    return newTable;
}

console.log(guests);
console.log(thrillingRides);
console.log(activities);
