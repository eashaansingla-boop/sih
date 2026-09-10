const login = async (req, res, next) => {
  try {
    const { email, role, mine_id } = req.body;

    const demoUsers = {
      mine_official: {
        id: 'u-101',
        name: 'Rajesh Sharma',
        role: 'mine_official',
        email: email || 'rajesh.sharma@bccl.gov.in',
        assigned_mine: 'Jharia Open Cast Mine Pit-3',
        mine_id: mine_id || 'mine-1',
        designation: 'Mine Safety Manager',
      },
      corporate: {
        id: 'u-102',
        name: 'Anita Desai',
        role: 'corporate',
        email: email || 'anita.desai@coalindia.in',
        assigned_mine: 'All Subsidiaries (BCCL, ECL, MCL, CCL)',
        mine_id: null,
        designation: 'General Manager (Safety & Compliance)',
      },
      regulator: {
        id: 'u-103',
        name: 'Dr. Sanjeev Kumar',
        role: 'regulator',
        email: email || 'sanjeev.kumar@dgms.gov.in',
        assigned_mine: 'National Coal Inspection Region',
        mine_id: null,
        designation: 'Director of Mines Safety (DGMS)',
      },
      contractor: {
        id: 'u-104',
        name: 'Ramesh Gupta',
        role: 'contractor',
        email: email || 'r.gupta@minetech.co.in',
        assigned_mine: 'Jharia Open Cast Mine Pit-3',
        mine_id: 'mine-1',
        company: 'MineTech Infra Corp',
        designation: 'Contractor Operations Head',
      },
    };

    const userRole = role || 'mine_official';
    const user = demoUsers[userRole] || demoUsers['mine_official'];

    return res.status(200).json({
      success: true,
      token: `demo-jwt-token-${user.role}-${Date.now()}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: 'u-101',
        name: 'Rajesh Sharma',
        role: 'mine_official',
        email: 'rajesh.sharma@bccl.gov.in',
        assigned_mine: 'Jharia Open Cast Mine Pit-3',
        mine_id: 'mine-1',
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getCurrentUser,
  getMe: getCurrentUser,
  logout,
};
