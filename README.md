default ruleset:
```json
{
 "colors": {
  "dead": "#222222",
  "alive": "#00ff88",
  "cat": "#0099ff",
  "zombie": "#ff0055"
 },
 "rules": {
  "dead": [
   {
    "next": "alive",
    "conditions": [
     {
      "state": "alive",
      "count": [
       3
      ]
     }
    ]
   },
   {
    "next": "cat",
    "conditions": [
     {
      "state": "cat",
      "count": [
       2,
       3
      ]
     }
    ]
   }
  ],
  "alive": [
   {
    "next": "dead",
    "conditions": [
     {
      "state": "alive",
      "count": [
       0,
       1,
       4,
       5,
       6,
       7,
       8
      ]
     }
    ]
   },
   {
    "next": "zombie",
    "conditions": [
     {
      "state": "zombie",
      "count": [
       1,
       2
      ]
     }
    ]
   }
  ],
  "cat": [
   {
    "next": "dead",
    "conditions": [
     {
      "state": "cat",
      "count": [
       0,
       1,
       7,
       8
      ]
     }
    ]
   },
   {
    "next": "alive",
    "conditions": [
     {
      "state": "alive",
      "count": [
       2,
       3
      ]
     }
    ]
   }
  ],
  "zombie": [
   {
    "next": "dead",
    "conditions": [
     {
      "state": "alive",
      "count": [
       0
      ]
     }
    ]
   },
   {
    "next": "zombie",
    "conditions": [
     {
      "state": "zombie",
      "count": [
       2,
       3,
       4
      ]
     }
    ]
   }
  ]
 }
}
```
Conways Game Of Life:
```json
{
 "colors": {
  "dead": "#222222",
  "alive": "#00ff88"
 },
 "rules": {
  "dead": [
   {
    "next": "alive",
    "conditions": [
     {
      "state": "alive",
      "count": [
       3
      ]
     }
    ]
   }
  ],
  "alive": [
   {
    "next": "dead",
    "conditions": [
     {
      "state": "alive",
      "count": [
       0,
       1,
       4,
       5,
       6,
       7,
       8
      ]
     }
    ]
   }
  ]
 }
}
```
