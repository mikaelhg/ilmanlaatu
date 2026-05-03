import "./App.css";
import AirQualityGraph from "./components/AirQualityGraph";

function App() {
  return <div>
    <AirQualityGraph field='PM25_PT1H_avg' domainMax={50}
      title='PM2.5 in Helsinki' />
    <AirQualityGraph field='PM10_PT1H_avg' domainMax={100}
      title='PM10 in Helsinki' />
  </div>;
}

export default App;
