# Coal Mine Smart Governance & Predictive Safety: Data Dictionary

This document defines all parameters in the unified data schema, bridging the **Operational Governance Backend** and the **DGMS Annual Report 2024 Machine Learning Predictive Risk Model**.

---

## 1. Common Parameters (15 Features & Targets)

These parameters exist in both the operational backend tables and the ML training template.

| Parameter | Type | Unit / Format | DGMS / Statutory Standard | Description |
| :--- | :--- | :--- | :--- | :--- |
| `mine_id` | String / UUID | `mine-XXX` | Unique Mine Identifier | Primary key linking telemetry, inspections, and corporate data. |
| `mine_name` | String | Text | Approved DGMS Colliery Name | Name of the coal mine site. |
| `latitude` | Float | Decimal Degrees | WGS84 Geo-Coordinates | Physical site latitude for GIS spatial mapping. |
| `longitude` | Float | Decimal Degrees | WGS84 Geo-Coordinates | Physical site longitude for GIS spatial mapping. |
| `methane_ppm` | Float / Int | PPM (parts per million) | CMR 2017 Reg 153 (Threshold: 500 ppm; Danger: 12,500 ppm / 1.25%) | Real-time continuous $CH_4$ gas telemetry reading. |
| `spm_ug_m3` / `dust_mg_m3` | Float | $\mu g/m^3$ or $mg/m^3$ ($1 mg/m^3 = 1000 \mu g/m^3$) | CPCB Environmental Limit < $250 \mu g/m^3$ ($0.25 mg/m^3$) | Suspended particulate matter and respirable coal dust concentration. |
| `inspection_score` | Float | $0 - 100$ | DGMS Periodic Audit Standard | Score awarded during most recent official safety audit. |
| `ppe_compliance` | Float | Percentage ($0 - 100\%$) | Mines Rules 1955 Rule 29B | Percentage of workers wearing certified helmets, boots, dust masks, and safety lamps. |
| `previous_accidents` | Integer | Count | DGMS Section 23 Serious/Fatal Notices | Total reportable and fatal accidents at this mine in past 36 months. |
| `previous_near_misses` | Integer | Count | Dangerous Occurrences Register (CMR Reg 8) | High-potential near miss events recorded in past 12 months. |
| `open_compliance_issues` | Integer | Count | DGMS Form IV Violation Notices | Unresolved statutory violations or overdue corrective actions. |
| `days_since_last_inspection` | Integer | Days | DGMS Statutory Audit Frequency | Days elapsed since the last comprehensive DGMS/internal safety inspection. |
| `production_deviation` | Float | Percentage ($\pm\%$) | Coal Controller Organization (CCO) Quota | Deviation of current production from statutory baseline/target. |
| `accident_occurred` | Integer / Boolean | `0` or `1` | **Prediction Target 1** | Binary label: whether a reportable accident occurred in the observation window. |
| `accident_severity` | Categorical | `None`, `Minor`, `Serious`, `Fatal` | **Prediction Target 2** | Severity grade according to DGMS classification standards. |

---

## 2. Extended Machine Learning Parameters (14 Additional Features)

These features provide deep context on physical, operational, and mechanical failure risk as emphasized in the DGMS Annual Report 2024.

| Parameter | Type | Unit | Statutory Context | ML Feature Significance |
| :--- | :--- | :--- | :--- | :--- |
| `company` | Categorical | Subsidiary Name | CIL / SCCL / Private Leaseholder | Controls for corporate safety budget, culture, and standardized operating procedures. |
| `state` | Categorical | Indian State | State Pollution Control Board / DGMS Zone | Geo-regulatory zone (Jharkhand, West Bengal, Odisha, Chhattisgarh, MP, Telangana). |
| `mine_type` | Categorical | `Open Cast`, `Underground`, `Mixed` | CMR 2017 Chapters IX (OCP) vs X (UG) | Critical baseline split: underground mines face roof falls and gas accumulation; opencast mines face dumper/haul road and slope stability risks. |
| `depth` | Float | Meters ($m$) | Geotechnical Rock Mechanics | Deep mines exhibit higher strata stress, higher rock temperature, and increased gas desorption rates. |
| `production_tpd` | Float | Tons per Day | Operational Scale | High-throughput mines experience heavier heavy earth-moving machinery (HEMM) traffic density. |
| `workers` | Integer | Headcount | Shifts Deployment Count | Total workforce exposed to site hazards during the monitoring cycle. |
| `shift` | Categorical | `Morning (A)`, `Evening (B)`, `Night (C)` | DGMS Circ. on Fatigue & Circadian Hazards | Night shifts statistically record higher operator fatigue and machinery collisions. |
| `working_hours` | Float | Hours (Std: 8.0) | Mines Act 1952 Section 30 | Overtime beyond 8 hours exponentially correlates with attentional lapses. |
| `co_ppm` | Float | PPM | CMR 2017 Reg 155 (Warning > 15 ppm, Evacuate > 50 ppm) | Carbon monoxide is the earliest indicator of spontaneous combustion (underground coal fires). |
| `co2_ppm` | Float | PPM | Statutory Limit < 5000 ppm (0.5%) | Carbon dioxide (blackdamp) indicates stagnant air, oxygen deficiency, or sealed area leakage. |
| `temperature` | Float | Degrees Celsius ($^\circ C$) | DGMS Wet-Bulb Heat Stress Standard (< $33.5^\circ C$) | Extreme underground or pit heat impairs operator reaction times. |
| `humidity` | Float | Relative Humidity ($\%$) | Moisture & Heat Index | High humidity prevents sweat evaporation, increasing miner exhaustion. |
| `ventilation_rate` | Float | Airflow Velocity ($m/s$) | CMR 2017 Reg 153 (> $1.0 m/s$ at working faces) | Low air velocity causes toxic/flammable gas pockets to stagnate. |
| `equipment_age` | Float | Average Years | HEMM Life Cycle Guidelines | Older dumpers, shovels, and conveyors suffer hydraulic leaks and brake failures. |
| `equipment_fault_count` | Integer | Monthly Fault Logs | DGMS Top Fatality Factor (Machinery) | Direct proxy for mechanical unreliability and preventive maintenance failure. |
| `training_compliance` | Float | Percentage ($0 - 100\%$) | Mines Vocational Training Rules 1966 | Percentage of workforce that attended mandatory annual safety refresher modules. |

---

## 3. Recommended Machine Learning Pipeline

```text
[ Raw Telemetry & Logs ]
         │
         ├── Sensor Stream (CH4, CO, CO2, Dust, Temp, Humidity, Airflow)
         ├── Operations Stream (Production TPD, Shift, Depth, Workers, Equipment Faults)
         └── Governance Stream (Inspection Score, PPE Compliance, Open Issues, Training)
         │
         ▼
[ Feature Preprocessing & Scaling ]
   - Standard Scaler on numerical variables (depth, gas concentrations, airflow)
   - One-Hot / Target Encoding on categorical (mine_type, subsidiary, shift)
         │
         ▼
[ Multi-Target Prediction Models ]
   ├── Model 1 (XGBoost / Random Forest Classifier): Predicts accident_occurred (0 vs 1)
   └── Model 2 (Multi-Class Ordinal Classifier): Predicts accident_severity (None, Minor, Serious, Fatal)
         │
         ▼
[ Governance API & Decision Support ]
   - Updates backend risk_score (0-100) & risk_level (Low/Moderate/High/Critical)
   - Triggers automated alerts and escalations before serious incidents occur
```
