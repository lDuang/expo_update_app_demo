import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Updates from 'expo-updates';
import { useState, useEffect } from 'react';

export default function App() {
  const [updateInfo, setUpdateInfo] = useState('');

  useEffect(() => {
    // 显示当前运行版本信息
    setUpdateInfo(`Update ID: ${Updates.updateId || 'embedded'}\nRuntime: ${Updates.runtimeVersion}`);
  }, []);

  const checkForUpdate = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        alert('更新已下载！重启应用以应用更新。');
      } else {
        alert('已是最新版本');
      }
    } catch (e: any) {
      alert('检查更新失败：' + e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expo 更新测试 - V2</Text>
      <Text style={styles.info}>{updateInfo}</Text>
      <Button title="检查更新" onPress={checkForUpdate} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
});
