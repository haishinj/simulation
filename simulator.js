GitHubリポジトリで完全版のコードを一発で作成するための手順をご案内します。

以下の2つのファイルをリポジトリに作成しましょう：

1. まず、リポジトリのメインページで「Add file」→「Create new file」をクリックします

2. 最初に `index.html` ファイルを作成します：

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ライブチャット代理店向け収益シミュレーター</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/recharts/umd/Recharts.min.js"></script>
  <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
</head>
<body class="bg-gray-100 p-4">
  <div id="root" class="max-w-6xl mx-auto"></div>

  <script type="text/babel" src="simulator.js"></script>
  <script type="text/babel">
    ReactDOM.render(<LivechatROISimulator />, document.getElementById('root'));
  </script>
</body>
</html>
```

3. ファイル名に「index.html」と入力し、「Commit new file」をクリックします

4. 次に、「Add file」→「Create new file」をクリックして、2つ目のファイル `simulator.js` を作成します：

```jsx
const { useState, useEffect } = React;
const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } = Recharts;

const LivechatROISimulator = () => {
  // 月間売上関連の設定
  const [selfSales, setSelfSales] = useState(300);
  const [partnerSales, setPartnerSales] = useState(0);
  const [salesPerFemale, setSalesPerFemale] = useState(50);
  
  // コスト関連の設定
  const [adCost, setAdCost] = useState(10); // 最低値は10のため
  const [rentCost, setRentCost] = useState(15);
  const [utilityCost, setUtilityCost] = useState(5);
  const [miscCost, setMiscCost] = useState(3);
  const [managerCost, setManagerCost] = useState(0);
  const [femaleRate, setFemaleRate] = useState(30);
  const [referralRate, setReferralRate] = useState(6);
  
  // 初期投資関連の設定
  const [propertyInitialCost, setPropertyInitialCost] = useState(30);
  const [interiorCost, setInteriorCost] = useState(30);
  const [equipmentCost, setEquipmentCost] = useState(10);
  // 初期投資額は物件初期費用、内装費、機材費の合計
  const initialInvestment = propertyInitialCost + interiorCost + equipmentCost;
  
  // 求人関連の設定
  const [recruitmentCount, setRecruitmentCount] = useState(3);
  const [entryRate, setEntryRate] = useState(50);
  
  // 計算結果を保持するstate
  const [results, setResults] = useState({
    totalSales: 0,
    fanzaRate: 0,
    selfRevenue: 0,
    partnerRevenue: 0,
    monthlyTotalRevenue: 0,
    femaleFee: 0,
    referralFee: 0,
    totalCost: 0,
    monthlyNetProfit: 0,
    paybackMonth: 0,
    roi8Months: 0,
    roi12Months: 0,
    roi24Months: 0,
    cumulativeProfit8Months: 0,
    cumulativeProfit12Months: 0,
    cumulativeProfit24Months: 0
  });
  
  // チャート用データ
  const [chartData, setChartData] = useState([]);
  const [costBreakdownData, setCostBreakdownData] = useState([]);
  
  // 女性の質の向上計算
  const calculateQualityBonus = () => {
    return 1 + (Math.floor(recruitmentCount / 5) * 0.05);
  };
  
  // FANZAの料率を計算
  const calculateFanzaRate = (totalSales) => {
    if (totalSales >= 4000) return 0.60;
    if (totalSales >= 3000) return 0.59;
    if (totalSales >= 2000) return 0.58;
    if (totalSales >= 1000) return 0.57;
    if (totalSales >= 600) return 0.56;
    return 0.55;
  };
  
  // すべての計算を実行
  const calculateAll = () => {
    // 求人効果による女性一人当たり売上の調整
    const adjustedSalesPerFemale = salesPerFemale * calculateQualityBonus();
    
    // 合計売上の計算
    const totalSales = selfSales + partnerSales;
    
    // FANZA料率の計算
    const fanzaRate = calculateFanzaRate(totalSales);
    
    // 収益計算
    const selfRevenue = selfSales * fanzaRate;
    const partnerRevenue = partnerSales * fanzaRate;
    const monthlyTotalRevenue = selfRevenue + partnerRevenue;
    
    // 女性手数料と紹介料
    const femaleFee = monthlyTotalRevenue * (femaleRate / 100);
    const referralFee = monthlyTotalRevenue * (referralRate / 100);
    
    // 総コスト
    const totalCost = adCost + rentCost + utilityCost + miscCost + managerCost;
    
    // 月間純利益
    const monthlyNetProfit = monthlyTotalRevenue - femaleFee - referralFee - totalCost;
    
    // 投資回収月の計算
    const paybackMonth = monthlyNetProfit > 0 ? Math.ceil(initialInvestment / monthlyNetProfit) : 999;
    
    // 期間別ROIの計算
    const cumulativeProfit8Months = monthlyNetProfit * 8;
    const cumulativeProfit12Months = monthlyNetProfit * 12;
    const cumulativeProfit24Months = monthlyNetProfit * 24;
    
    const roi8Months = (cumulativeProfit8Months / initialInvestment) * 100;
    const roi12Months = (cumulativeProfit12Months / initialInvestment) * 100;
    const roi24Months = (cumulativeProfit24Months / initialInvestment) * 100;
    
    // 結果をセット
    setResults({
      totalSales,
      fanzaRate: fanzaRate * 100,
      selfRevenue,
      partnerRevenue,
      monthlyTotalRevenue,
      femaleFee,
      referralFee,
      totalCost,
      monthlyNetProfit,
      paybackMonth,
      roi8Months,
      roi12Months,
      roi24Months,
      cumulativeProfit8Months,
      cumulativeProfit12Months,
      cumulativeProfit24Months
    });
    
    // チャートデータの生成
    generateChartData(monthlyNetProfit, initialInvestment);
    
    // コスト内訳のデータ生成
    setCostBreakdownData([
      { name: '広告費', value: adCost },
      { name: '家賃', value: rentCost },
      { name: '通信・光熱費', value: utilityCost },
      { name: '雑費', value: miscCost },
      { name: 'マネージャー人件費', value: managerCost },
      { name: '女性手数料', value: femaleFee },
      { name: '紹介料', value: referralFee }
    ]);
  };
  
  // チャートデータの生成
  const generateChartData = (monthlyNetProfit, initialInvestment) => {
    const data = [];
    let cumulativeProfit = -initialInvestment;
    
    for (let month = 1; month <= 24; month++) {
      cumulativeProfit += monthlyNetProfit;
      data.push({
        month: month,
        profit: monthlyNetProfit,
        cumulativeProfit: cumulativeProfit
      });
    }
    
    setChartData(data);
  };
  
  // 入力値が変更されたときに再計算
  useEffect(() => {
    calculateAll();
  }, [
    selfSales, partnerSales, salesPerFemale, adCost, rentCost, utilityCost, 
    miscCost, managerCost, femaleRate, referralRate, 
    propertyInitialCost, interiorCost, equipmentCost, recruitmentCount, entryRate
  ]);
  
  // 色の設定
  const COLORS = ['#4361ee', '#3a86ff', '#4cc9f0', '#06d6a0', '#90be6d', '#f94144', '#f8961e'];
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-lg">
      <h1 className="text-xl font-bold text-center mb-4 pb-2 border-b-2 border-blue-300">
        ライブチャット代理店向け<br className="sm:hidden"/>収益シミュレーター
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 左側：入力フォーム */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 pb-1 border-b border-gray-200">パラメータ設定</h2>
          
          {/* 月間売上関連 */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 bg-blue-100 p-2 rounded">月間売上関連</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 flex justify-between">
                  <span>自社売上</span>
                  <span className="text-blue-600">{selfSales}万円</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={selfSales}
                  onChange={(e) => setSelfSales(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex justify-between">
                  <span>パートナー売上</span>
                  <span className="text-blue-600">{partnerSales}万円</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={partnerSales}
                  onChange={(e) => setPartnerSales(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex justify-between">
                  <span>女性一人当たり売上</span>
                  <span className="text-blue-600">{salesPerFemale}万円</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={salesPerFemale}
                  onChange={(e) => setSalesPerFemale(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          {/* コスト関連 */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 bg-green-100 p-2 rounded">コスト関連</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1 flex justify-between">
                  <span>広告費</span>
                  <span className="text-green-600">{adCost}万円</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={adCost}
                  onChange={(e) => setAdCost(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex justify-between">
                  <span>家賃</span>
                  <span className="text-green-600">{rentCost}万円</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={rentCost}
                  onChange={(e) => setRentCost(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex justify-between">
                  <span>通信・光熱費</span>
                  <span className="text-green-600">{utilityCost}万円</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="5"
                  value={utilityCost}
                  onChange={(e) => setUtilityCost(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex justify-between">
                  <span>雑費</span>
                  <span className="text-green-600">{miscCost}万円</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={miscCost}
                  onChange={(e) => setMiscCost(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex justify-between">
                  <span>マネージャー人件費</span>
                  <span className="text-green-600">{managerCost}万円</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={managerCost}
                  onChange={(e) => setManagerCost(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex justify-between">
                  <span>女性料率</span>
                  <span className="text-green-600">{femaleRate}%</span>
                </label>
                <input
                  type="range"
                  min="30"
                  max="40"
                  step="1"
                  value={femaleRate}
                  onChange={(e) => setFemaleRate(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex justify-between">
                  <span>紹介料</span>
                  <span className="text-green-600">{referralRate}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="9"
                  step="1"
                  value={referralRate}
                  onChange={(e) => setReferralRate(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          {/* 初期投資関連 */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 bg-yellow-100 p-2 rounded">初期投資関連</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1 flex justify-between">
                  <span>初期投資額(合計)</span>
                  <span className="text-yellow-600">{initialInvestment}万円</span>
                </label>
                <div className="w-full h-2 bg-gray-200 rounded-lg"></div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex justify-between">
                  <span>物件初期費用</span>
                  <span className="text-yellow-600">{propertyInitialCost}万円</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="10"
                  value={propertyInitialCost}
                  onChange={(e) => setPropertyInitialCost(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex justify-between">
                  <span>内装費</span>
                  <span className="text-yellow-600">{interiorCost}万円</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="10"
                  value={interiorCost}
                  onChange={(e) => setInteriorCost(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex justify-between">
                  <span>機材費</span>
                  <span className="text-yellow-600">{equipmentCost}万円</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={equipmentCost}
                  onChange={(e) => setEquipmentCost(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          {/* 求人関連 */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 bg-purple-100 p-2 rounded">求人関連</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1 flex justify-between">
                  <span>求人数</span>
                  <span className="text-purple-600">{recruitmentCount}件</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={recruitmentCount}
                  onChange={(e) => setRecruitmentCount(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex justify-between">
                  <span>入店率</span>
                  <span className="text-purple-600">{entryRate}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="10"
                  value={entryRate}
                  onChange={(e) => setEntryRate(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="text-sm bg-yellow-50 p-2 rounded border border-yellow-200">
                <p>求人効果: 女性一人当たり売上 {(salesPerFemale * calculateQualityBonus()).toFixed(1)}万円</p>
                <p className="text-xs text-gray-600">（求人数が5件増えるごとに売上が5%向上）</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 右側：結果表示 */}
        <div>
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h2 className="text-lg font-semibold mb-4 pb-1 border-b border-gray-200">シミュレーション結果</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="bg-blue-50 p-2 rounded">
                <div className="text-sm text-gray-600">自社売上</div>
                <div className="text-lg font-bold">{selfSales.toLocaleString()}万円</div>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <div className="text-sm text-gray-600">パートナー売上</div>
                <div className="text-lg font-bold">{partnerSales.toLocaleString()}万円</div>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <div className="text-sm text-gray-600">合計売上</div>
                <div className="text-lg font-bold">{results.totalSales.toLocaleString()}万円</div>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <div className="text-sm text-gray-600">FANZA料率</div>
                <div className="text-lg font-bold">{results.fanzaRate.toFixed(1)}%</div>
              </div>
            </div>
            
            <h3 className="font-medium mb-2 text-blue-700">月間収支</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="bg-green-50 p-2 rounded">
                <div className="text-sm text-gray-600">月間総収益</div>
                <div className="text-lg font-bold">{results.monthlyTotalRevenue.toLocaleString()}万円</div>
              </div>
              <div className="bg-red-50 p-2 rounded">
                <div className="text-sm text-gray-600">総コスト</div>
                <div className="text-lg font-bold">{results.totalCost.toLocaleString()}万円</div>
              </div>
              <div className="bg-red-50 p-2 rounded">
                <div className="text-sm text-gray-600">女性手数料</div>
                <div className="text-lg font-bold">{results.femaleFee.toLocaleString()}万円</div>
              </div>
              <div className="bg-red-50 p-2 rounded">
                <div className="text-sm text-gray-600">紹介料</div>
                <div className="text-lg font-bold">{results.referralFee.toLocaleString()}万円</div>
              </div>
              <div className={`${results.monthlyNetProfit >= 0 ? 'bg-green-100' : 'bg-red-100'} p-2 rounded col-span-1 sm:col-span-2`}>
                <div className="text-sm text-gray-600">月間純利益</div>
                <div className="text-xl font-bold">{Math.round(results.monthlyNetProfit).toLocaleString()}万円</div>
              </div>
            </div>
            
            <h3 className="font-medium mb-2 text-green-700">期間別収支</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className={`${results.cumulativeProfit8Months >= 0 ? 'bg-green-50' : 'bg-red-50'} p-2 rounded`}>
                <div className="text-sm text-gray-600">8ヶ月累積</div>
                <div className="text-lg font-bold">{results.cumulativeProfit8Months.toLocaleString()}万円</div>
                <div className="text-sm">ROI: {results.roi8Months.toFixed(1)}%</div>
              </div>
              <div className={`${results.cumulativeProfit12Months >= 0 ? 'bg-green-50' : 'bg-red-50'} p-2 rounded`}>
                <div className="text-sm text-gray-600">12ヶ月累積</div>
                <div className="text-lg font-bold">{results.cumulativeProfit12Months.toLocaleString()}万円</div>
                <div className="text-sm">ROI: {results.roi12Months.toFixed(1)}%</div>
              </div>
              <div className={`${results.cumulativeProfit24Months >= 0 ? 'bg-green-50' : 'bg-red-50'} p-2 rounded`}>
                <div className="text-sm text-gray-600">24ヶ月累積</div>
                <div className="text-lg font-bold">{results.cumulativeProfit24Months.toLocaleString()}万円</div>
                <div className="text-sm">ROI: {results.roi24Months.toFixed(1)}%</div>
              </div>
            </div>
            
            <h3 className="font-medium mb-2 text-purple-700">KPI指標</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="bg-purple-50 p-2 rounded">
                <div className="text-sm text-gray-600">投資回収月</div>
                <div className="text-lg font-bold">
                  {results.paybackMonth === 999 ? '回収不可' : `${results.paybackMonth}ヶ月`}
                </div>
              </div>
              <div className="bg-purple-50 p-2 rounded">
                <div className="text-sm text-gray-600">単月黒字化</div>
                <div className="text-lg font-bold">
                  {results.monthlyNetProfit >= 0 ? '初月から黒字' : '赤字継続'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="font-medium mb-3 text-center bg-blue-50 p-1 rounded">収益推移（24ヶ月）</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toLocaleString()}万円`]} />
                <Legend />
                <Line type="monotone" dataKey="cumulativeProfit" name="累積利益" stroke="#8884d8" />
                <Line type="monotone" dataKey="profit" name="月間利益" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mb-3 text-center bg-blue-50 p-1 rounded">コスト内訳</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value.toLocaleString()}万円`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center mt-2">
              {costBreakdownData.map((item, index) => (
                <div key={index} className="flex items-center mx-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full mr-1" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                  />
                  <span className="text-xs">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-white rounded-lg shadow">
        <div className="flex items-center mb-2">
          <div className="w-1 h-4 bg-red-400 rounded mr-2"></div>
          <h3 className="font-medium text-red-700">注意事項</h3>
        </div>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
          <li>このシミュレーターは参考値であり、実際の結果を保証するものではありません</li>
<li>FANZA料率は売上合計に基づいて自動計算されます</li>
<li>求人効果は女性一人当たり売上に影響します（求人数5件ごとに売上が5%向上）</li>
<li>投資判断は本シミュレーションのみに依存せず、専門家への相談も推奨します</li>
</ul>
</div>
</div>
);
};
