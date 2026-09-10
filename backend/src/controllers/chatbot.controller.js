const { mines, mine_compliance_status, incidents, alerts, calculateMineAIRisk } = require('../models/dataStore');

const processChatQuery = async (req, res, next) => {
  try {
    const { query, language } = req.body;
    const lang = (language || 'en').toLowerCase();
    const text = (query || '').toLowerCase();

    let reply = '';
    let category = 'general';
    let dataPayload = null;

    if (text.includes('status') || text.includes('compliance') || text.includes('स्थिति') || text.includes('অবস্থা') || text.includes('ସ୍ଥିତି')) {
      category = 'compliance_status';
      const highRisk = mines.filter(m => m.risk_level === 'High' || m.risk_level === 'Critical');
      
      if (lang === 'hi') {
        reply = `वर्तमान प्रणाली स्थिति: ${mines.length} कोयला खदानों की निगरानी की जा रही है। ${highRisk.length} खदानें (झरिया पिट-3, नॉर्थ करणपुरा) उच्च जोखिम / नियम उल्लंघन श्रेणी में हैं।`;
      } else if (lang === 'bn') {
        reply = `বর্তমান সিস্টেমের অবস্থা: মোট ${mines.length} টি কয়লা খনি পর্যবেক্ষণ করা হচ্ছে। ${highRisk.length} টি খনি (ঝরিয়া পিট-৩, নর্থ করণপুরা) উচ্চ ঝুঁকি হিসেবে চিহ্নিত।`;
      } else if (lang === 'or') {
        reply = `ସାମ୍ପ୍ରତିକ ସ୍ଥିତି: ସମୁଦାୟ ${mines.length} ଟି କୋଇଲା ଖଣି ଅନୁଧ୍ୟାନ କରାଯାଉଛି। ${highRisk.length} ଟି ଖଣି (ଝରିଆ ପିଟ୍-୩, ନର୍ଥ କରଣପୁରା) ଉଚ୍ଚ ବିପଦ ଶ୍ରେଣୀରେ ଅଛନ୍ତି।`;
      } else {
        reply = `System Overview: Monitoring ${mines.length} coal mine sites across BCCL, ECL, MCL, and CCL. Currently, ${highRisk.length} mines (Jharia Pit-3, North Karanpura) are flagged in High/Critical risk status due to methane gas spikes and overdue dust suppression compliance.`;
      }
      dataPayload = mines;

    } else if (text.includes('jharia') || text.includes('झरिया') || text.includes('ঝরিয়া') || text.includes('ଝରିଆ')) {
      const jharia = mines.find(m => m.id === 'mine-1');
      const risk = calculateMineAIRisk('mine-1');
      if (lang === 'hi') {
        reply = `झरिया ओपन कास्ट माइन पिट-3 विवरण: जोखिम स्कोर ${jharia.risk_score} (${jharia.risk_level})। मीथेन स्तर ${jharia.methane_ppm} ppm है (सीमा: 500 ppm)। धूल जल छिड़काव अनुपालन लंबित है।`;
      } else if (lang === 'bn') {
        reply = `ঝরিয়া ওপেন কাস্ট খনি পিট-৩: ঝুঁকি স্কোর ${jharia.risk_score} (${jharia.risk_level})। মিথেন স্তর ${jharia.methane_ppm} ppm (সীমা: ৫০০ ppm)।`;
      } else {
        reply = `Jharia Open Cast Pit-3 Details: Current Risk Score is ${jharia.risk_score}/100 (${jharia.risk_level} Risk). Telemetry: Methane CH4 at ${jharia.methane_ppm} ppm (Limit: 500 ppm), SPM Dust at ${jharia.spm_ug_m3} µg/m³. Factors: ${risk.factors.join('; ')}.`;
      }
      dataPayload = risk;

    } else if (text.includes('alert') || text.includes('incident') || text.includes('위험') || text.includes('चेतावनी') || text.includes('সতর্কতা')) {
      category = 'alerts';
      const unreadAlerts = alerts.filter(a => a.status === 'Unread');
      if (lang === 'hi') {
        reply = `वर्तमान में ${unreadAlerts.length} सक्रिय गंभीर चेतावनियाँ हैं। उत्तर करणपुरा में मीथेन गैस लीक और झरिया में डंपर तेल रिसाव घटना रिपोर्ट की गई है।`;
      } else {
        reply = `Alert Feed: There are ${unreadAlerts.length} active high-priority alerts. Key alert: Methane Gas Spike in North Karanpura (1150 ppm) & Hydraulic Leakage on Haulage Dumper HD-44 in Jharia.`;
      }
      dataPayload = unreadAlerts;

    } else if (text.includes('report') || text.includes('inspection') || text.includes('रिपोर्ट') || text.includes('রিপোর্ট')) {
      category = 'field_help';
      if (lang === 'hi') {
        reply = `फ़ील्ड रिपोर्ट दर्ज करने के लिए, नेविगेशन बार में 'Field Reporting App' पर क्लिक करें। यदि इंटरनेट नहीं है, तो आपकी रिपोर्ट स्वचालित रूप से सहेजी जाएगी और ऑनलाइन होने पर सिंक हो जाएगी।`;
      } else {
        reply = `To file a field safety report or worker attendance, switch to the 'Field Reporting App' view in the left sidebar. The app operates offline and automatically queues your geo-tagged reports until network connectivity is restored.`;
      }

    } else {
      reply = `Hello! I am CoalGuard AI, your multilingual coal mine governance assistant. You can ask me about mine compliance status, high-risk alerts, gas sensor anomalies, or field inspection procedures in English, Hindi, Bengali, or Odia.`;
    }

    return res.status(200).json({
      success: true,
      query,
      language: lang,
      reply,
      category,
      data: dataPayload,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processChatQuery,
};
