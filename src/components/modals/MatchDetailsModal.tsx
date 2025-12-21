import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  MapPin,
  Trophy,
  Target,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Goal {
  scorer: string;
  assist?: string;
  minute: number;
  goalType?: string;
}

interface AIInsight {
  category: string;
  type: 'strength' | 'weakness' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

interface PlayerPerformance {
  playerName: string;
  position: string;
  rating: number;
  strengths: string[];
  improvements: string[];
}

interface MatchDetails {
  id: string;
  title: string;
  opponent: string;
  date: string;
  venue: string;
  competition: string;
  homeScore: number;
  awayScore: number;
  status: 'uploaded' | 'processing' | 'analyzed' | 'failed';
  goals?: Goal[];
  aiInsights?: AIInsight[];
  playerPerformances?: PlayerPerformance[];
}

interface MatchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: MatchDetails | null;
}

const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({
  isOpen,
  onClose,
  match,
}) => {
  const [expandedSection, setExpandedSection] = useState<string>('overview');

  if (!match) return null;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-600';
      case 'medium':
        return 'bg-yellow-600';
      case 'low':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'weakness':
        return <AlertCircle size={16} className="text-red-400" />;
      case 'recommendation':
        return <TrendingUp size={16} className="text-blue-400" />;
      default:
        return <Activity size={16} className="text-gray-400" />;
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-400';
    if (rating >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#111112] rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-[#111112] border-b border-gray-700 p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{match.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mt-2">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{new Date(match.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin size={14} />
                      <span>{match.venue}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Trophy size={14} />
                      <span>{match.competition}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div
                className="bg-gray-800 rounded-lg p-6 cursor-pointer"
                onClick={() => toggleSection('overview')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <Trophy className="text-yellow-400" size={20} />
                    <span>Match Overview</span>
                  </h3>
                  {expandedSection === 'overview' ? (
                    <ChevronUp className="text-gray-400" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-400" size={20} />
                  )}
                </div>

                <AnimatePresence>
                  {expandedSection === 'overview' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-700 rounded-lg p-4">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-white mb-2">
                              {match.homeScore} - {match.awayScore}
                            </div>
                            <div className="text-gray-400">Final Score</div>
                            <div className={`mt-2 px-3 py-1 rounded-full text-xs inline-block ${
                              match.status === 'analyzed'
                                ? 'bg-green-600 text-white'
                                : match.status === 'processing'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-blue-600 text-white'
                            }`}>
                              {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-700 rounded-lg p-4">
                          <div className="space-y-3">
                            <div>
                              <div className="text-gray-400 text-sm">Your Team</div>
                              <div className="text-white font-semibold">Manchester United</div>
                            </div>
                            <div>
                              <div className="text-gray-400 text-sm">Opponent</div>
                              <div className="text-white font-semibold">{match.opponent}</div>
                            </div>
                            <div>
                              <div className="text-gray-400 text-sm">Result</div>
                              <div
                                className={`font-semibold ${
                                  match.homeScore > match.awayScore
                                    ? 'text-green-400'
                                    : match.homeScore < match.awayScore
                                    ? 'text-red-400'
                                    : 'text-yellow-400'
                                }`}
                              >
                                {match.homeScore > match.awayScore
                                  ? 'Victory'
                                  : match.homeScore < match.awayScore
                                  ? 'Defeat'
                                  : 'Draw'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {match.goals && match.goals.length > 0 && (
                        <div className="mt-4 bg-gray-700 rounded-lg p-4">
                          <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                            <Target size={16} />
                            <span>Goals</span>
                          </h4>
                          <div className="space-y-2">
                            {match.goals.map((goal, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-3 text-sm"
                              >
                                <div className="flex items-center space-x-1">
                                  <Clock size={14} className="text-gray-400" />
                                  <span className="text-gray-400 font-medium min-w-[40px]">
                                    {goal.minute}'
                                  </span>
                                </div>
                                <span className="text-white font-semibold">{goal.scorer}</span>
                                {goal.assist && (
                                  <>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-400">assist:</span>
                                    <span className="text-blue-400">{goal.assist}</span>
                                  </>
                                )}
                                {goal.goalType && goal.goalType !== 'normal' && (
                                  <span className="text-xs text-gray-500 italic">
                                    ({goal.goalType})
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {match.status === 'analyzed' && match.aiInsights && (
                <div
                  className="bg-gray-800 rounded-lg p-6 cursor-pointer"
                  onClick={() => toggleSection('insights')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                      <Activity className="text-blue-400" size={20} />
                      <span>AI Performance Insights</span>
                    </h3>
                    {expandedSection === 'insights' ? (
                      <ChevronUp className="text-gray-400" size={20} />
                    ) : (
                      <ChevronDown className="text-gray-400" size={20} />
                    )}
                  </div>

                  <AnimatePresence>
                    {expandedSection === 'insights' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <div className="space-y-3">
                          {match.aiInsights.map((insight, index) => (
                            <div key={index} className="bg-gray-700 rounded-lg p-4">
                              <div className="flex items-start space-x-3">
                                <div className="mt-1">{getInsightIcon(insight.type)}</div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      <h4 className="text-white font-semibold">
                                        {insight.title}
                                      </h4>
                                      <span
                                        className={`px-2 py-0.5 rounded text-xs text-white ${getImpactColor(
                                          insight.impact
                                        )}`}
                                      >
                                        {insight.impact}
                                      </span>
                                    </div>
                                    <span className="text-xs text-gray-400 uppercase">
                                      {insight.category}
                                    </span>
                                  </div>
                                  <p className="text-gray-300 text-sm">{insight.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {match.status === 'analyzed' && match.playerPerformances && (
                <div
                  className="bg-gray-800 rounded-lg p-6 cursor-pointer"
                  onClick={() => toggleSection('players')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                      <Users className="text-green-400" size={20} />
                      <span>Player Performance Analysis</span>
                    </h3>
                    {expandedSection === 'players' ? (
                      <ChevronUp className="text-gray-400" size={20} />
                    ) : (
                      <ChevronDown className="text-gray-400" size={20} />
                    )}
                  </div>

                  <AnimatePresence>
                    {expandedSection === 'players' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <div className="space-y-4">
                          {match.playerPerformances.map((player, index) => (
                            <div key={index} className="bg-gray-700 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="text-white font-semibold">
                                    {player.playerName}
                                  </h4>
                                  <p className="text-gray-400 text-sm">{player.position}</p>
                                </div>
                                <div
                                  className={`text-3xl font-bold ${getRatingColor(
                                    player.rating
                                  )}`}
                                >
                                  {player.rating.toFixed(1)}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {player.strengths.length > 0 && (
                                  <div>
                                    <h5 className="text-green-400 text-sm font-semibold mb-2 flex items-center space-x-1">
                                      <TrendingUp size={14} />
                                      <span>Strengths</span>
                                    </h5>
                                    <ul className="space-y-1">
                                      {player.strengths.map((strength, i) => (
                                        <li
                                          key={i}
                                          className="text-gray-300 text-sm flex items-start space-x-2"
                                        >
                                          <span className="text-green-400">•</span>
                                          <span>{strength}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {player.improvements.length > 0 && (
                                  <div>
                                    <h5 className="text-yellow-400 text-sm font-semibold mb-2 flex items-center space-x-1">
                                      <TrendingDown size={14} />
                                      <span>Areas for Improvement</span>
                                    </h5>
                                    <ul className="space-y-1">
                                      {player.improvements.map((improvement, i) => (
                                        <li
                                          key={i}
                                          className="text-gray-300 text-sm flex items-start space-x-2"
                                        >
                                          <span className="text-yellow-400">•</span>
                                          <span>{improvement}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-[#111112] border-t border-gray-700 p-6">
              <button
                onClick={onClose}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MatchDetailsModal;
