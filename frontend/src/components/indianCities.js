// Indian cities coordinates database (no external API needed)
// Covers all major cities, state capitals, and popular university/college towns
const INDIAN_CITIES = {
  // Metro cities
  'delhi': { lat: 28.6139, lng: 77.2090, name: 'Delhi, National Capital Territory' },
  'new delhi': { lat: 28.6139, lng: 77.2090, name: 'New Delhi, Delhi' },
  'mumbai': { lat: 19.0760, lng: 72.8777, name: 'Mumbai, Maharashtra' },
  'bombay': { lat: 19.0760, lng: 72.8777, name: 'Mumbai, Maharashtra' },
  'bangalore': { lat: 12.9716, lng: 77.5946, name: 'Bangalore, Karnataka' },
  'bengaluru': { lat: 12.9716, lng: 77.5946, name: 'Bengaluru, Karnataka' },
  'hyderabad': { lat: 17.3850, lng: 78.4867, name: 'Hyderabad, Telangana' },
  'chennai': { lat: 13.0827, lng: 80.2707, name: 'Chennai, Tamil Nadu' },
  'madras': { lat: 13.0827, lng: 80.2707, name: 'Chennai, Tamil Nadu' },
  'kolkata': { lat: 22.5726, lng: 88.3639, name: 'Kolkata, West Bengal' },
  'calcutta': { lat: 22.5726, lng: 88.3639, name: 'Kolkata, West Bengal' },
  'pune': { lat: 18.5204, lng: 73.8567, name: 'Pune, Maharashtra' },
  'ahmedabad': { lat: 23.0225, lng: 72.5714, name: 'Ahmedabad, Gujarat' },
  
  // North India
  'chandigarh': { lat: 30.7333, lng: 76.7794, name: 'Chandigarh' },
  'jaipur': { lat: 26.9124, lng: 75.7873, name: 'Jaipur, Rajasthan' },
  'lucknow': { lat: 26.8467, lng: 80.9462, name: 'Lucknow, Uttar Pradesh' },
  'kanpur': { lat: 26.4499, lng: 80.3319, name: 'Kanpur, Uttar Pradesh' },
  'agra': { lat: 27.1767, lng: 78.0081, name: 'Agra, Uttar Pradesh' },
  'varanasi': { lat: 25.3176, lng: 82.9739, name: 'Varanasi, Uttar Pradesh' },
  'banaras': { lat: 25.3176, lng: 82.9739, name: 'Varanasi, Uttar Pradesh' },
  'allahabad': { lat: 25.4358, lng: 81.8463, name: 'Prayagraj, Uttar Pradesh' },
  'prayagraj': { lat: 25.4358, lng: 81.8463, name: 'Prayagraj, Uttar Pradesh' },
  'noida': { lat: 28.5355, lng: 77.3910, name: 'Noida, Uttar Pradesh' },
  'greater noida': { lat: 28.4744, lng: 77.5040, name: 'Greater Noida, Uttar Pradesh' },
  'gurgaon': { lat: 28.4595, lng: 77.0266, name: 'Gurugram, Haryana' },
  'gurugram': { lat: 28.4595, lng: 77.0266, name: 'Gurugram, Haryana' },
  'faridabad': { lat: 28.4089, lng: 77.3178, name: 'Faridabad, Haryana' },
  'ghaziabad': { lat: 28.6692, lng: 77.4538, name: 'Ghaziabad, Uttar Pradesh' },
  'meerut': { lat: 28.9845, lng: 77.7064, name: 'Meerut, Uttar Pradesh' },
  'dehradun': { lat: 30.3165, lng: 78.0322, name: 'Dehradun, Uttarakhand' },
  'haridwar': { lat: 29.9457, lng: 78.1642, name: 'Haridwar, Uttarakhand' },
  'rishikesh': { lat: 30.0869, lng: 78.2676, name: 'Rishikesh, Uttarakhand' },
  'shimla': { lat: 31.1048, lng: 77.1734, name: 'Shimla, Himachal Pradesh' },
  'manali': { lat: 32.2396, lng: 77.1887, name: 'Manali, Himachal Pradesh' },
  'dharamshala': { lat: 32.2190, lng: 76.3234, name: 'Dharamshala, Himachal Pradesh' },
  'amritsar': { lat: 31.6340, lng: 74.8723, name: 'Amritsar, Punjab' },
  'ludhiana': { lat: 30.9010, lng: 75.8573, name: 'Ludhiana, Punjab' },
  'jalandhar': { lat: 31.3260, lng: 75.5762, name: 'Jalandhar, Punjab' },
  'patiala': { lat: 30.3398, lng: 76.3869, name: 'Patiala, Punjab' },
  'jammu': { lat: 32.7266, lng: 74.8570, name: 'Jammu, Jammu & Kashmir' },
  'srinagar': { lat: 34.0837, lng: 74.7973, name: 'Srinagar, Jammu & Kashmir' },
  'leh': { lat: 34.1526, lng: 77.5771, name: 'Leh, Ladakh' },
  
  // Rajasthan
  'jodhpur': { lat: 26.2389, lng: 73.0243, name: 'Jodhpur, Rajasthan' },
  'udaipur': { lat: 24.5854, lng: 73.7125, name: 'Udaipur, Rajasthan' },
  'ajmer': { lat: 26.4499, lng: 74.6399, name: 'Ajmer, Rajasthan' },
  'kota': { lat: 25.2138, lng: 75.8648, name: 'Kota, Rajasthan' },
  'bikaner': { lat: 28.0229, lng: 73.3119, name: 'Bikaner, Rajasthan' },
  'jaisalmer': { lat: 26.9157, lng: 70.9083, name: 'Jaisalmer, Rajasthan' },
  'pushkar': { lat: 26.4898, lng: 74.5511, name: 'Pushkar, Rajasthan' },
  
  // West India
  'surat': { lat: 21.1702, lng: 72.8311, name: 'Surat, Gujarat' },
  'vadodara': { lat: 22.3072, lng: 73.1812, name: 'Vadodara, Gujarat' },
  'rajkot': { lat: 22.3039, lng: 70.8022, name: 'Rajkot, Gujarat' },
  'gandhinagar': { lat: 23.2156, lng: 72.6369, name: 'Gandhinagar, Gujarat' },
  'nagpur': { lat: 21.1458, lng: 79.0882, name: 'Nagpur, Maharashtra' },
  'nashik': { lat: 19.9975, lng: 73.7898, name: 'Nashik, Maharashtra' },
  'aurangabad': { lat: 19.8762, lng: 75.3433, name: 'Aurangabad, Maharashtra' },
  'goa': { lat: 15.2993, lng: 74.1240, name: 'Goa' },
  'panaji': { lat: 15.4909, lng: 73.8278, name: 'Panaji, Goa' },
  'navi mumbai': { lat: 19.0330, lng: 73.0297, name: 'Navi Mumbai, Maharashtra' },
  'thane': { lat: 19.2183, lng: 72.9781, name: 'Thane, Maharashtra' },
  'lonavala': { lat: 18.7546, lng: 73.4062, name: 'Lonavala, Maharashtra' },
  
  // South India
  'mysore': { lat: 12.2958, lng: 76.6394, name: 'Mysore, Karnataka' },
  'mysuru': { lat: 12.2958, lng: 76.6394, name: 'Mysuru, Karnataka' },
  'mangalore': { lat: 12.9141, lng: 74.8560, name: 'Mangalore, Karnataka' },
  'coimbatore': { lat: 11.0168, lng: 76.9558, name: 'Coimbatore, Tamil Nadu' },
  'madurai': { lat: 9.9252, lng: 78.1198, name: 'Madurai, Tamil Nadu' },
  'trichy': { lat: 10.7905, lng: 78.7047, name: 'Tiruchirappalli, Tamil Nadu' },
  'tiruchirappalli': { lat: 10.7905, lng: 78.7047, name: 'Tiruchirappalli, Tamil Nadu' },
  'kochi': { lat: 9.9312, lng: 76.2673, name: 'Kochi, Kerala' },
  'cochin': { lat: 9.9312, lng: 76.2673, name: 'Kochi, Kerala' },
  'thiruvananthapuram': { lat: 8.5241, lng: 76.9366, name: 'Thiruvananthapuram, Kerala' },
  'trivandrum': { lat: 8.5241, lng: 76.9366, name: 'Thiruvananthapuram, Kerala' },
  'kozhikode': { lat: 11.2588, lng: 75.7804, name: 'Kozhikode, Kerala' },
  'calicut': { lat: 11.2588, lng: 75.7804, name: 'Kozhikode, Kerala' },
  'visakhapatnam': { lat: 17.6868, lng: 83.2185, name: 'Visakhapatnam, Andhra Pradesh' },
  'vizag': { lat: 17.6868, lng: 83.2185, name: 'Visakhapatnam, Andhra Pradesh' },
  'vijayawada': { lat: 16.5062, lng: 80.6480, name: 'Vijayawada, Andhra Pradesh' },
  'tirupati': { lat: 13.6288, lng: 79.4192, name: 'Tirupati, Andhra Pradesh' },
  'warangal': { lat: 17.9784, lng: 79.5941, name: 'Warangal, Telangana' },
  'pondicherry': { lat: 11.9416, lng: 79.8083, name: 'Puducherry' },
  'puducherry': { lat: 11.9416, lng: 79.8083, name: 'Puducherry' },
  'ooty': { lat: 11.4102, lng: 76.6950, name: 'Ooty, Tamil Nadu' },
  'salem': { lat: 11.6643, lng: 78.1460, name: 'Salem, Tamil Nadu' },
  'vellore': { lat: 12.9165, lng: 79.1325, name: 'Vellore, Tamil Nadu' },
  
  // East India
  'bhubaneswar': { lat: 20.2961, lng: 85.8245, name: 'Bhubaneswar, Odisha' },
  'puri': { lat: 19.8135, lng: 85.8312, name: 'Puri, Odisha' },
  'cuttack': { lat: 20.4625, lng: 85.8830, name: 'Cuttack, Odisha' },
  'patna': { lat: 25.6093, lng: 85.1376, name: 'Patna, Bihar' },
  'ranchi': { lat: 23.3441, lng: 85.3096, name: 'Ranchi, Jharkhand' },
  'jamshedpur': { lat: 22.8046, lng: 86.2029, name: 'Jamshedpur, Jharkhand' },
  'dhanbad': { lat: 23.7957, lng: 86.4304, name: 'Dhanbad, Jharkhand' },
  'siliguri': { lat: 26.7271, lng: 88.3953, name: 'Siliguri, West Bengal' },
  'darjeeling': { lat: 27.0360, lng: 88.2627, name: 'Darjeeling, West Bengal' },
  'durgapur': { lat: 23.5204, lng: 87.3119, name: 'Durgapur, West Bengal' },
  'howrah': { lat: 22.5958, lng: 88.2636, name: 'Howrah, West Bengal' },
  
  // Northeast
  'guwahati': { lat: 26.1445, lng: 91.7362, name: 'Guwahati, Assam' },
  'shillong': { lat: 25.5788, lng: 91.8933, name: 'Shillong, Meghalaya' },
  'imphal': { lat: 24.8170, lng: 93.9368, name: 'Imphal, Manipur' },
  'agartala': { lat: 23.8315, lng: 91.2868, name: 'Agartala, Tripura' },
  'aizawl': { lat: 23.7271, lng: 92.7176, name: 'Aizawl, Mizoram' },
  'kohima': { lat: 25.6751, lng: 94.1086, name: 'Kohima, Nagaland' },
  'itanagar': { lat: 27.0844, lng: 93.6053, name: 'Itanagar, Arunachal Pradesh' },
  'gangtok': { lat: 27.3389, lng: 88.6065, name: 'Gangtok, Sikkim' },
  
  // Central India
  'bhopal': { lat: 23.2599, lng: 77.4126, name: 'Bhopal, Madhya Pradesh' },
  'indore': { lat: 22.7196, lng: 75.8577, name: 'Indore, Madhya Pradesh' },
  'gwalior': { lat: 26.2183, lng: 78.1828, name: 'Gwalior, Madhya Pradesh' },
  'jabalpur': { lat: 23.1815, lng: 79.9864, name: 'Jabalpur, Madhya Pradesh' },
  'raipur': { lat: 21.2514, lng: 81.6296, name: 'Raipur, Chhattisgarh' },
  'bilaspur': { lat: 22.0797, lng: 82.1409, name: 'Bilaspur, Chhattisgarh' },
  
  // University towns / popular student destinations
  'pilani': { lat: 28.3670, lng: 75.6047, name: 'Pilani, Rajasthan (BITS)' },
  'roorkee': { lat: 29.8543, lng: 77.8880, name: 'Roorkee, Uttarakhand (IIT)' },
  'kharagpur': { lat: 22.3460, lng: 87.2320, name: 'Kharagpur, West Bengal (IIT)' },
  'manipal': { lat: 13.3525, lng: 74.7928, name: 'Manipal, Karnataka' },
  'vit': { lat: 12.9165, lng: 79.1325, name: 'VIT, Vellore' },
  'mathura': { lat: 27.4924, lng: 77.6737, name: 'Mathura, Uttar Pradesh' },
  'aligarh': { lat: 27.8974, lng: 78.0880, name: 'Aligarh, Uttar Pradesh (AMU)' },
  'sonipat': { lat: 28.9930, lng: 77.0190, name: 'Sonipat, Haryana' },
  'mohali': { lat: 30.7046, lng: 76.7179, name: 'Mohali, Punjab' },
  'panchkula': { lat: 30.6942, lng: 76.8606, name: 'Panchkula, Haryana' },
  'kurukshetra': { lat: 29.9695, lng: 76.8783, name: 'Kurukshetra, Haryana' },
  'ambala': { lat: 30.3782, lng: 76.7767, name: 'Ambala, Haryana' },
  'karnal': { lat: 29.6857, lng: 76.9905, name: 'Karnal, Haryana' },
  'panipat': { lat: 29.3909, lng: 76.9635, name: 'Panipat, Haryana' },
  'hisar': { lat: 29.1492, lng: 75.7217, name: 'Hisar, Haryana' },
  'rohtak': { lat: 28.8955, lng: 76.6066, name: 'Rohtak, Haryana' },
  
  // DU / Delhi nearby
  'du': { lat: 28.6889, lng: 77.2099, name: 'Delhi University, Delhi' },
  'delhi university': { lat: 28.6889, lng: 77.2099, name: 'Delhi University, Delhi' },
  'iit delhi': { lat: 28.5450, lng: 77.1926, name: 'IIT Delhi, Delhi' },
  'jnu': { lat: 28.5402, lng: 77.1662, name: 'JNU, Delhi' },
  'dtu': { lat: 28.7499, lng: 77.1176, name: 'DTU, Delhi' },
  'ip university': { lat: 28.6700, lng: 77.3735, name: 'IP University, Delhi' },
  'amity': { lat: 28.5440, lng: 77.3340, name: 'Amity University, Noida' },
  'bits pilani': { lat: 28.3670, lng: 75.6047, name: 'BITS Pilani, Rajasthan' },
  'iit bombay': { lat: 19.1334, lng: 72.9133, name: 'IIT Bombay, Mumbai' },
  'iit madras': { lat: 12.9915, lng: 80.2337, name: 'IIT Madras, Chennai' },
  'iit kanpur': { lat: 26.5123, lng: 80.2329, name: 'IIT Kanpur' },
  'iit kharagpur': { lat: 22.3149, lng: 87.3105, name: 'IIT Kharagpur' },
  'iit roorkee': { lat: 29.8644, lng: 77.8965, name: 'IIT Roorkee' },
  'iit guwahati': { lat: 26.1930, lng: 91.6960, name: 'IIT Guwahati' },
  'iit hyderabad': { lat: 17.5947, lng: 78.1229, name: 'IIT Hyderabad' },
  'iisc bangalore': { lat: 13.0219, lng: 77.5671, name: 'IISc Bangalore' },
};

// Fuzzy match: try exact, then partial match
export const geocodeCityLocal = (cityName) => {
  if (!cityName) return null;
  const key = cityName.toLowerCase().trim();
  
  // Exact match
  if (INDIAN_CITIES[key]) {
    const c = INDIAN_CITIES[key];
    return { lat: c.lat, lng: c.lng, displayName: c.name };
  }
  
  // Partial match (city name contains or is contained by a key)
  for (const [k, v] of Object.entries(INDIAN_CITIES)) {
    if (k.includes(key) || key.includes(k)) {
      return { lat: v.lat, lng: v.lng, displayName: v.name };
    }
  }
  
  return null;
};

export default INDIAN_CITIES;
