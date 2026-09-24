import 'package:flutter/material.dart';

void main() {
  runApp(const LifeLinkRequesterApp());
}

class LifeLinkRequesterApp extends StatelessWidget {
  const LifeLinkRequesterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'LIFE-LINK Requester',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.red,
        scaffoldBackgroundColor: const Color(0xFFP9FAFB),
      ),
      home: const RequesterHomeScreen(),
    );
  }
}

class RequesterHomeScreen extends StatefulWidget {
  const RequesterHomeScreen({super.key});

  @override
  State<RequesterHomeScreen> createState() => _RequesterHomeScreenState();
}

class _RequesterHomeScreenState extends State<RequesterHomeScreen> {
  int _selectedIndex = 0;

  final List<Widget> _pages = [
    const RequesterDashboardView(),
    const CreateRequestFormView(),
    const ActiveRequestsListView(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('LIFE-LINK Requester', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: const Color(0xFFDC2626),
        foregroundColor: Colors.white,
      ),
      body: _pages[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (idx) => setState(() => _selectedIndex = idx),
        selectedItemColor: const Color(0xFFDC2626),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.add_circle), label: 'Create Ticket'),
          BottomNavigationBarItem(icon: Icon(Icons.list_alt), label: 'My Requests'),
        ],
      ),
    );
  }
}

class RequesterDashboardView extends StatelessWidget {
  const RequesterDashboardView({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: ListView(
        children: [
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text('Welcome, Vikram Singh', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  SizedBox(height: 4),
                  Text('Emergency Patient Relative Requester', style: TextStyle(fontSize: 12, color: Colors.grey)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            color: const Color(0xFFFFFBEB),
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Row(
                children: const [
                  Icon(Icons.warning_amber_rounded, color: Color(0xFFB45309)),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Potentially compatible based on registered blood group. Final eligibility must be confirmed by medical professionals.',
                      style: TextStyle(fontSize: 11, color: Color(0xFFB45309)),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class CreateRequestFormView extends StatelessWidget {
  const CreateRequestFormView({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Form(
        child: ListView(
          children: [
            const Text('Create Emergency Blood Request', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: 'O+',
              decoration: const InputDecoration(labelText: 'Blood Group Required', border: OutlineInputBorder()),
              items: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) {
                return DropdownMenuItem(value: bg, child: Text(bg));
              }).toList(),
              onChanged: (val) {},
            ),
            const SizedBox(height: 12),
            TextFormField(
              initialValue: '2',
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Units Required', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 12),
            TextFormField(
              initialValue: 'Lucknow',
              decoration: const InputDecoration(labelText: 'City', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFDC2626),
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
              onPressed: () {},
              child: const Text('Submit Blood Request Ticket', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }
}

class ActiveRequestsListView extends StatelessWidget {
  const ActiveRequestsListView({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          child: ListTile(
            title: const Text('REQ-1001 • 3 Units O+', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFDC2626))),
            subtitle: const Text('Lucknow • Apex Hospital\nStatus: MATCHING DONORS'),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            isThreeLine: true,
            onTap: () {},
          ),
        ),
      ],
    );
  }
}
