import AirQualityGraph from "../components/AirQualityGraph";

export default function MainView() {
  return (
    <div className="grid grid-cols-2 h-svh overflow-hidden">
      <div className="h-half-svh">
        <AirQualityGraph field="AQINDEX_PT1H_avg" domainMax={5} title="Air quality index" />
      </div>
      <div className="h-half-svh">
        <AirQualityGraph field="QBCPM25_PT1H_avg" domainMax={5} title="Black coal" />
      </div>
      <div className="h-half-svh">
        <AirQualityGraph field="PM25_PT1H_avg" domainMax={50} title="PM2.5 in Helsinki" />
      </div>
      <div className="h-half-svh">
        <AirQualityGraph field="PM10_PT1H_avg" domainMax={100} title="PM10 in Helsinki" />
      </div>
    </div>
  );
}
