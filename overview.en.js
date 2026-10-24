window.UAV_OVERVIEW = {
  "title": "Whole-System Map",
  "lead": "This opening view uses a generic quadrotor as an educational example to show how commands become motion, where energy comes from, and how the design process proceeds. The project's actual baseline is a forward-flight aircraft with four fixed electric propulsors; it is not a hovering quadrotor.",
  "quadrotor": {
    "projectNote": "The quadrotor diagram below is a generic teaching example only. The project aircraft is a forward-flight design with four fixed electric propulsors.",
    "command": [
      {
        "title": "Pilot command",
        "detail": "RC or mission mode"
      },
      {
        "title": "Flight Controller",
        "detail": "Compare command with actual state"
      },
      {
        "title": "4 ESC outputs",
        "detail": "Adjust motor speeds individually"
      },
      {
        "title": "Motor and propeller",
        "detail": "Generate thrust"
      },
      {
        "title": "Aircraft motion",
        "detail": "Measure again with Sensors"
      }
    ],
    "power": [
      {
        "title": "Battery",
        "detail": "Electrical energy"
      },
      {
        "title": "Power distribution",
        "detail": "High-current path to ESCs"
      },
      {
        "title": "4 ESCs and motors",
        "detail": "Propulsion power"
      },
      {
        "title": "Voltage regulator",
        "detail": "Power for FC and Sensors"
      }
    ],
    "loop": "The Flight Controller compares the desired command with IMU and other Sensor data and continuously adjusts motor outputs. This cycle is called closed-loop control.",
    "axes": [
      {
        "key": "THR",
        "title": "Throttle · altitude",
        "detail": "Increasing the coordinated thrust of all four propellers increases lift; altitude is controlled by balancing thrust and weight."
      },
      {
        "key": "ROLL",
        "title": "Roll · side-to-side rotation",
        "detail": "A thrust difference between the left and right sides tilts the aircraft about its longitudinal axis."
      },
      {
        "key": "PITCH",
        "title": "Pitch · nose up and down",
        "detail": "A thrust difference between front and rear rotates the aircraft about its lateral axis and can create forward or backward motion."
      },
      {
        "key": "YAW",
        "title": "Yaw · horizontal rotation",
        "detail": "Two propellers rotate in each direction. Changing the relative speed of clockwise and counterclockwise groups produces torque about the vertical axis."
      }
    ],
    "moduleCountNote": "The general list has 12 major subsystems. The Companion Computer was added as an advanced section; this project teaches Communication Architecture and antennas, as well as wiring and safety, separately. The educational material is therefore organized into 15 modules.",
    "note": "The exact CW/CCW motor arrangement and mapping from M1 to M4 to the frame depend on aircraft configuration; verify them against Autopilot settings before testing."
  },
  "domains": [
    {
      "key": "ME",
      "title": "Mechanical",
      "label": "Structure and placement",
      "branches": [
        {
          "title": "Airframe and layout",
          "detail": "Frame, component installation, and center of gravity",
          "help": "The structure supports components and carries flight loads. Battery and Payload locations affect balance, access, and center of gravity.",
          "modules": [
            "M01"
          ]
        },
        {
          "title": "Propulsion geometry",
          "detail": "Propeller, rotation clearance, and structural effects",
          "help": "Propeller diameter and pitch must suit the Motor and arm spacing to provide enough thrust and safe clearance from the structure.",
          "modules": [
            "M02"
          ]
        }
      ]
    },
    {
      "key": "EL",
      "title": "Electrical",
      "label": "Energy and connections",
      "branches": [
        {
          "title": "Propulsion chain",
          "detail": "Motor, ESC, and power command",
          "help": "The ESC converts battery power into suitable motor currents and controls propeller speed.",
          "modules": [
            "M03",
            "M04"
          ]
        },
        {
          "title": "Battery to loads",
          "detail": "Energy storage, power distribution, and Harness",
          "help": "The Battery supplies high current to the motors; converters create suitable voltages for electronics, and wiring connects power and data correctly while keeping them separated.",
          "modules": [
            "M05",
            "M06",
            "M14"
          ]
        }
      ]
    },
    {
      "key": "CO",
      "title": "Control",
      "label": "Guidance and safety",
      "branches": [
        {
          "title": "State and guidance",
          "detail": "Flight control and position estimation",
          "help": "The Flight Controller uses gyroscope and accelerometer data to estimate attitude and motion; GNSS provides position and ground speed. The controller then adjusts motor speeds to execute the pilot's command.",
          "modules": [
            "M07",
            "M08"
          ]
        },
        {
          "title": "Recovery from faults",
          "detail": "Failsafe, flight prerequisites, and redundancy",
          "help": "If RC, the Battery, or a Sensor has a problem, the system must detect it and switch to predefined behavior, such as return, landing, or limiting the Mission. Data-link loss must not automatically stop flight control.",
          "modules": [
            "M15"
          ]
        }
      ]
    },
    {
      "key": "CM",
      "title": "Communication",
      "label": "Data links",
      "branches": [
        {
          "title": "Operator and ground",
          "detail": "RC command and Ground Station monitoring",
          "help": "RC provides the pilot's direct command and backup path; Telemetry sends aircraft status to the Ground Station for display and monitoring.",
          "modules": [
            "M09",
            "M10"
          ]
        },
        {
          "title": "Wireless architecture",
          "detail": "Data Link, antennas, and RF coexistence",
          "help": "The data link can carry video and mission data. Antenna placement and radio interference must be managed so GNSS and RC remain reliable.",
          "modules": [
            "M13"
          ]
        }
      ]
    },
    {
      "key": "PL",
      "title": "Payload",
      "label": "Imaging and processing",
      "branches": [
        {
          "title": "Mission imaging",
          "detail": "RGB and Thermal cameras",
          "help": "The imaging Sensor must suit the mission target, field of view, vibration, lighting, and carried mass.",
          "modules": [
            "M11"
          ]
        },
        {
          "title": "Onboard processing",
          "detail": "Detection, Tracking, and data storage",
          "help": "The Companion Computer processes images, produces AI results, and stores or sends data; this needs power and heat removal.",
          "modules": [
            "M12"
          ]
        }
      ]
    },
    {
      "key": "TH",
      "title": "Thermal",
      "label": "Heat dissipation",
      "branches": [
        {
          "title": "Propulsion heat",
          "detail": "Motor, ESC, and Battery under load",
          "help": "High current and long operation produce heat; ventilation, current limits, and temperature tests help prevent premature failure.",
          "modules": [
            "M03",
            "M04",
            "M05"
          ]
        },
        {
          "title": "Payload heat",
          "detail": "Computer, Radio, and cooling path",
          "help": "A Computer and Radio may heat up in a compact airframe. Installation location and airflow must be designed along with mass and power use.",
          "modules": [
            "M12",
            "M13"
          ]
        }
      ]
    },
    {
      "key": "SW",
      "title": "Software",
      "label": "Flight and mission logic",
      "branches": [
        {
          "title": "Autopilot",
          "detail": "Flight modes, control, and Failsafe",
          "help": "Flight software reads Sensors, runs the control loop, and activates defined safe behavior during communication loss or a Fault.",
          "modules": [
            "M07",
            "M15"
          ]
        },
        {
          "title": "Vision and data",
          "detail": "AI, result recording, and messaging",
          "help": "Mission software analyzes Camera data and records or sends results; its failure must not disable the basic flight-control path.",
          "modules": [
            "M12",
            "M10"
          ]
        }
      ]
    }
  ],
  "process": [
    {
      "label": "Mission needs",
      "detail": "Clarify the target and flight scenario: Payload, range, endurance, environment, and expected output.",
      "input": "User needs and operating limits",
      "output": "Mission profile and measurable requirements"
    },
    {
      "label": "Architecture and interfaces",
      "detail": "Define how subsystems work together and what power, data, space, and connections they require.",
      "input": "Mission requirements",
      "output": "Block diagram, subsystem boundaries, and interface matrix"
    },
    {
      "label": "System budgets",
      "detail": "Estimate mass and center of gravity, peak and average power, energy for each mission phase, and heat with margins.",
      "input": "Initial architecture and candidate specifications",
      "output": "Mass/CG, power/energy, and thermal budgets with margins and open items"
    },
    {
      "label": "Candidate selection",
      "detail": "Assess components against needs, interfaces, and other subsystem limits; a good part must also work in the whole system.",
      "input": "Budgets, interfaces, and component datasheets",
      "output": "Candidate list, selection rationale, and initial BOM version"
    },
    {
      "label": "Build and ground test",
      "detail": "Progress from component and subsystem tests to bench integration, power/sensor/communication checks, SIL/HIL, and full ground tests.",
      "input": "Built prototype and acceptance criteria",
      "output": "Test report, issues, changes, and readiness for flight"
    },
    {
      "label": "Incremental flight",
      "detail": "Progress step by step: stability, Navigation, Mission, imaging, then processing capabilities.",
      "input": "Ground-verified system and test plan",
      "output": "Flight data, verified limits, and revised design version"
    }
  ],
  "review": "Each test can change mass, power, component selection, or even mission needs; keep the design revision and test data together."
};

