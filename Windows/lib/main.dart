import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Мои задачи',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        // Глубокий черный фон как в оригинале
        scaffoldBackgroundColor: const Color(0xFF090A0C),
      ),
      home: const TodoScreen(),
    );
  }
}

class TodoScreen extends StatefulWidget {
  const TodoScreen({super.key});

  @override
  State<TodoScreen> createState() => _TodoScreenState();
}

class _TodoScreenState extends State<TodoScreen> {
  // Список задач для примера (как на твоем скрине)
  final List<Map<String, dynamic>> _todos = [
    {'title': 'протестить todo-лист веб', 'isDone': false},
    {'title': 'зделать todo-лист (веб)', 'isDone': true},
    {'title': 'зделать todo-лист (андроид)', 'isDone': true},
    {'title': 'тест веб паблик', 'isDone': true},
  ];

  @override
  Widget build(BuildContext context) {
    // Считаем выполненные задачи для индикатора 3/4
    int doneCount = _todos.where((t) => t['isDone'] == true).length;

    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32.0, vertical: 40.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Дата сверху
            Text(
              'ЧЕТВЕРГ, 4 ИЮНЯ',
              style: TextStyle(
                color: Colors.white.withOpacity(0.4),
                fontSize: 12,
                fontWeight: FontWeight.w600,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 8),
            
            // Заголовок и кругляшок 3/4
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Мои задачи',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 36,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                // Индикатор прогресса задач
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: const BoxDecoration(
                    color: Color(0xFF1B1D27),
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    '$doneCount/${_todos.length}',
                    style: const TextStyle(
                      color: Color(0xFF5B6DF6),
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Фильтры (Все, Активные, Готово)
            Row(
              children: [
                _buildFilterButton('Все', isActive: true),
                const SizedBox(width: 12),
                _buildFilterButton('Активные', isActive: false),
                const SizedBox(width: 12),
                _buildFilterButton('Готово', isActive: false),
              ],
            ),
            const SizedBox(height: 32),

            // Список карточек
            Expanded(
              child: ListView.builder(
                itemCount: _todos.length,
                itemBuilder: (context, index) {
                  final todo = _todos[index];
                  final bool isDone = todo['isDone'];

                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF14161A), // Цвет карточки
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: Colors.white.withOpacity(0.05),
                        width: 1,
                      ),
                    ),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                      leading: IconButton(
                        icon: Icon(
                          isDone ? Icons.check_circle : Icons.radio_button_unchecked,
                          color: isDone ? const Color(0xFF5B6DF6) : Colors.white.withOpacity(0.2),
                          size: 24,
                        ),
                        onPressed: () {
                          setState(() {
                            todo['isDone'] = !todo['isDone'];
                          });
                        },
                      ),
                      title: Text(
                        todo['title'],
                        style: TextStyle(
                          color: isDone ? Colors.white.withOpacity(0.3) : Colors.white,
                          fontSize: 16,
                          decoration: isDone ? TextDecoration.lineThrough : null,
                        ),
                      ),
                      trailing: Icon(
                        Icons.delete_outline,
                        color: Colors.white.withOpacity(0.2),
                        size: 20,
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
      // Кнопка плюса внизу справа
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: const Color(0xFF5B6DF6),
        shape: const CircleBorder(),
        child: const Icon(Icons.add, color: Colors.white, size: 28),
      ),
    );
  }

  // Вспомогательный виджет для кнопок фильтров
  Widget _buildFilterButton(String text, {required bool isActive}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
      decoration: BoxDecoration(
        color: isActive ? const Color(0xFF5B6DF6) : const Color(0xFF14161A),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isActive ? Colors.transparent : Colors.white.withOpacity(0.05),
        ),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: isActive ? Colors.white : Colors.white.withOpacity(0.4),
          fontWeight: FontWeight.w500,
          fontSize: 14,
        ),
      ),
    );
  }
}