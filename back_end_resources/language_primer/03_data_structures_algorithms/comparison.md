# 03 - Data Structures and Algorithms: Syntax Comparison

Quick reference only. See `concept.md` for the "why," and `java.ipynb` / `python.ipynb` / `cpp/dsa.h`+`cpp/dsa.cpp` for full worked examples.

| Operation | Java | Python | C++ |
|---|---|---|---|
| Stack: push | `deque.push(x)` (`ArrayDeque`) | `list.append(x)` | `stack.push(x)` (custom) or `stk.push(x)` (`std::stack`) |
| Stack: pop | `deque.pop()` | `list.pop()` | `stack.pop()` |
| Queue: enqueue | `deque.offer(x)` | `deque.append(x)` (`collections.deque`) | `q.push(x)` (`std::queue`) |
| Queue: dequeue | `deque.poll()` | `deque.popleft()` | `q.front(); q.pop();` |
| Map/dict: create | `new HashMap<K, V>()` | `{}` or `dict()` | `std::unordered_map<K, V>` |
| Map/dict: insert or update | `map.put(key, value)` | `d[key] = value` | `m[key] = value;` |
| Map/dict: get (may throw/crash on missing key) | `map.get(key)` | `d[key]` | `m.at(key)` |
| Map/dict: get with a default | `map.getOrDefault(key, def)` | `d.get(key, def)` | `m.count(key) ? m[key] : def` |
| Map/dict: check a key exists | `map.containsKey(key)` | `key in d` | `m.count(key) > 0` or `m.find(key) != m.end()` |
| List/vector: create | `new ArrayList<T>()` | `[]` or `list()` | `std::vector<T>` |
| List/vector: append | `list.add(x)` | `list.append(x)` | `vec.push_back(x)` |
| List/vector: get by index | `list.get(i)` | `list[i]` | `vec[i]` or `vec.at(i)` |
| List/vector: size | `list.size()` | `len(list)` | `vec.size()` |
| Iterate over values | `for (T x : collection)` | `for x in collection:` | `for (T x : collection)` |
| Tree: insert | `tree.insert(id, name);` (custom) | `tree.insert(can_id, name)` (custom) | `tree.insert(canId, name);` (custom) |
| Tree: search by key | `tree.find(id)` (custom) | `tree.find(can_id)` (custom) | `tree.find(canId, outName)` (custom) |
| Tree: sorted (in-order) walk | `tree.forEachInOrder((id, name) -> ...)` (custom) | `for id, name in tree.in_order():` (custom) | `tree.forEachInOrder([](int id, const std::string& name) { ... });` (custom) |
| Binary search over sorted data | `binarySearchComparisons(entries, id)` (custom) | `binary_search_comparisons(entries, id)` (custom) | `binarySearchComparisons(entries, id)` (custom) |
