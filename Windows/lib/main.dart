import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const TodoApp());
}

enum FilterType { all, active, done }

class Todo {
  final String id;
  final String text;
  final bool completed;
  final int createdAt;

  Todo({
    required this.id,
    required this.text,
    required this.completed,
    required this.createdAt,
  });

  Todo copyWith({bool? completed}) {
    return Todo(
      id: id,
      text: text,
      completed: completed ?? this.completed,
      createdAt: createdAt,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'text': text,
        'completed': completed,
        'createdAt': createdAt,
      };

  factory Todo.fromJson(Map<String, dynamic> json) => Todo(
        id: json['id'],
        text: json['text'],
        completed: json['completed'],
        createdAt: json['createdAt'],
      );
}

class TodoApp extends StatelessWidget {
  const TodoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.system,
      theme: ThemeData(useMaterial3: true),
      darkTheme: ThemeData(useMaterial3: true, brightness: Brightness.dark),
      home: const TodoHome(),
    );
  }
}

class TodoHome extends StatefulWidget {
  const TodoHome({super.key});

  @override
  State<TodoHome> createState() => _TodoHomeState();
}

class _TodoHomeState extends State<TodoHome> {
  final TextEditingController controller = TextEditingController();
  final List<Todo> todos = [];
  FilterType filter = FilterType.all;

  late final File storageFile;

  @override
  void initState() {
    super.initState();
    storageFile = _initStorage();
    _load();
  }

  /// Определяем путь: ./data/todos.json рядом с exe
  File _initStorage() {
    final exeDir = File(Platform.resolvedExecutable).parent;
    final dataDir = Directory('${exeDir.path}/data');

    if (!dataDir.existsSync()) {
      dataDir.createSync(recursive: true);
    }

    final file = File('${dataDir.path}/todos.json');

    if (!file.existsSync()) {
      file.writeAsStringSync('[]');
    }

    return file;
  }

  void _load() {
    final raw = storageFile.readAsStringSync();
    final list = jsonDecode(raw) as List;
    todos
      ..clear()
      ..addAll(list.map((e) => Todo.fromJson(e)));
    setState(() {});
  }

  void _save() {
    storageFile.writeAsStringSync(
      jsonEncode(todos.map((e) => e.toJson()).toList()),
    );
    setState(() {});
  }

  void addTodo(String text) {
    todos.insert(
      0,
      Todo(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        text: text.trim(),
        completed: false,
        createdAt: DateTime.now().millisecondsSinceEpoch,
      ),
    );
    _save();
  }

  void toggle(Todo todo) {
    final i = todos.indexWhere((e) => e.id == todo.id);
    todos[i] = todo.copyWith(completed: !todo.completed);
    _save();
  }

  void remove(Todo todo) {
    todos.removeWhere((e) => e.id == todo.id);
    _save();
  }

  List<Todo> get filtered {
    switch (filter) {
      case FilterType.active:
        return todos.where((e) => !e.completed).toList();
      case FilterType.done:
        return todos.where((e) => e.completed).toList();
      default:
        return todos;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Todo')),
      floatingActionButton: FloatingActionButton(
        onPressed: openAdd,
        child: const Icon(Icons.add),
      ),
      body: Column(
        children: [
          filterBar(),
          Expanded(
            child: filtered.isEmpty
                ? const Center(child: Text('Пусто'))
                : ListView.builder(
                    itemCount: filtered.length,
                    itemBuilder: (_, i) {
                      final t = filtered[i];
                      return ListTile(
                        leading: Checkbox(
                          value: t.completed,
                          onChanged: (_) => toggle(t),
                        ),
                        title: Text(
                          t.text,
                          style: t.completed
                              ? const TextStyle(
                                  decoration: TextDecoration.lineThrough)
                              : null,
                        ),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete),
                          onPressed: () => remove(t),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget filterBar() {
    Widget chip(FilterType f, String text) => ChoiceChip(
          label: Text(text),
          selected: filter == f,
          onSelected: (_) => setState(() => filter = f),
        );

    return Padding(
      padding: const EdgeInsets.all(8),
      child: Wrap(
        spacing: 8,
        children: [
          chip(FilterType.all, 'All'),
          chip(FilterType.active, 'Active'),
          chip(FilterType.done, 'Done'),
        ],
      ),
    );
  }

  void openAdd() {
    controller.clear();
    showModalBottomSheet(
      context: context,
      builder: (_) => Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: controller,
              autofocus: true,
              onSubmitted: submit,
              decoration: const InputDecoration(labelText: 'New task'),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: () => submit(controller.text),
              child: const Text('Add'),
            ),
          ],
        ),
      ),
    );
  }

  void submit(String text) {
    if (text.trim().isEmpty) return;
    addTodo(text);
    Navigator.pop(context);
  }
}