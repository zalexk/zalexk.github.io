---
title: defaultdict 类
notebook: coding
tags:
- Python
---

# defaultdict 类
**特点：** key 不存在时会返回默认值，而不会报错
- If key exists, return its value
- If key D.N.E., return default value
	- **int:** returns `0`
	- **list:** returns `[]`
	- **str:** returns `""`
## 示例
```python
from collections import defaultdict
d = defaultdict(int)

d['apple'] = 5
print(d)
print(d['juices'])

"""
Output:
defaultdict(<class 'int'>, {'apple': 5})
0
"""
```
