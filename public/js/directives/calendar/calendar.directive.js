(function () {
  'use strict';

  angular
    .module('trucadence')
    .directive('calendar', function (
      jobProfileService,
      commonService,
      employerListService,
      calenderService,
      $rootScope
    ) {
      return {
        restrict: 'E',
        templateUrl: 'js/directives/calendar/calender.html',
        scope: {
          selected: '=',
          bar: '=',
          employer: '=',
          candidate: '=',
          getEmployerDetails: '&callbackFn'
        },
        link: function (scope, element, attrs) {
          scope.candidateList = [];
          scope.weeks = [];
          scope.listTimeLog = [];
          scope.timeLogDetails = {
            id: '',
            shift: '',
            startTime: '',
            endTime: '',
            hours: '',
            shiftRepeat: '',
            profile: '',
            month: '',
            year: '',
            day: '',
            employerId: '',
            employerShiftId: '',
            shiftJobProfileId: '',
            lastModifiedAt: '',
            weekNo: ''
          };

          scope.showme = false;
          scope.timeLogDetails.shift = {};
          scope.timeLogDetails.shiftRepeat = '';
          scope.timeLogDetails.profile = '';
          scope.IsVisible = false;
          scope.addTimeLog = true;
          scope.shiftIndexFlag = false;
          scope.timeValidation = false;
          scope.shiftIndex = -1;
          scope.month = new moment(new Date(scope.selected.split(' - ')[0]), 'MM-DD-YYYY');
          scope.hideEditBtn = true;
          scope.start = new moment(new Date(scope.selected.split(' - ')[0]), 'MM-DD-YYYY');
          var totalTimeInHr = [];
          var overTimeHrInWeek = [];
          var overTimeHrInDaily = [];
          scope.employerProfileDetails = [];
          scope.employerProfileShift = [];
          scope.updatedTimeSheetData = [];
          scope.employeeProfileList = [];
          scope.profileList = [];
          scope.selectedProfileName = '';
          scope.timeLogDetails.startTime = '';

          scope.daysArray = [{
              day: 'Sun',
              date: ''
            },
            {
              day: 'Mon',
              date: ''
            },
            {
              day: 'Tue',
              date: ''
            },
            {
              day: 'Wen',
              date: ''
            },
            {
              day: 'Thu',
              date: ''
            },
            {
              day: 'Fri',
              date: ''
            },
            {
              day: 'Sat',
              date: ''
            }
          ];

          if (scope.employer) {
            scope.addTimeLog = false;
          }

          // Used to fetch emplyers profile details
 
          scope.$watch('candidate', function () {
            console.log('selected:', scope.selected);
            scope.month = new moment(scope.selected.split(' - ')[0], 'MM-DD-YYYY');
            scope.start = new moment(scope.selected.split(' - ')[0], 'MM-DD-YYYY');
            getEmployerProfileDetails(scope, scope.employer);
          });
        
          scope.select = function (day, name) {
            scope.selectedDay = day;
            scope.selectedName = name;
            var startDate = new moment(scope.selectedDay.date._d).format('MM-DD-YYYY');
            var endDate = new moment(scope.selectedDay.date._d).add(7, 'day').format('MM-DD-YYYY');
            scope.selected = startDate + ' - ' + endDate ;
            
            if (day.timeLog.length > 0) {
              scope.IsVisible = true;
            } else {
              scope.IsVisible = false;
            }
          };

          // Assuming your time strings will always be (H*:)(m{0,2}:)s{0,2} and never negative

          scope.shiftSelect = function (profileShift) {
            scope.profileShift = profileShift;
            scope.Start_Time = scope.profileShift[0].Start_Time;
            scope.End_Time = scope.profileShift[0].End_Time;
          };

          // Used to reset modal data.

          scope.reset = function () {
            scope.timeLogDetails = {};
            scope.showme = false;
            scope.saveHide = false;
            scope.hideEditBtn = true;
            scope.selectedProfile = '';
            scope.timeValidation = false;
            scope.timeLogForm.$setPristine();
            window.jQuery('#flipFlop').modal('hide');
          };

          scope.next = function () {
            var employerObj = JSON.parse(scope.employer);
            var next = scope.month.clone();
            _removeTime(next.add(1, 'weeks'));
            scope.month.add(1, 'weeks');
            let formData = {
              employerId: employerObj.id,
              startDate: new moment(next).format('MM-DD-YYYY'),
              endDate: new moment(next).add(7, 'day').format('MM-DD-YYYY')
            };
            calenderService.getTimeSheetDetails(formData).then(
              function (data) {
                if (data.status === 200) {
                  scope.candidate = data.data;
                  scope.selected = formData.startDate + ' - ' + formData.endDate;
                  _buildMonth(scope, next, scope.month);
                  init();
                } else {
                  scope.candidate = [];
                  commonService.showSnackbar(
                    'error',
                    data.statusText,
                    data.status
                  );
                }
              },
              function (response) {
                scope.candidate = [];
                commonService.showSnackbar(
                  'error',
                  response.statusText,
                  response.status
                );
              }
            );
          };

          scope.previous = function () {
            var employerObj = JSON.parse(scope.employer);
            var previous = scope.month.clone();
            _removeTime(previous.subtract(1, 'weeks'));
            let formData = {
              employerId: employerObj.id,
              startDate: new moment(previous).format('MM-DD-YYYY'),
              endDate: new moment(previous).add(7, 'day').format('MM-DD-YYYY')
            };
            
            scope.month.subtract(1, 'weeks');
            calenderService.getTimeSheetDetails(formData).then(
              function (data) {
                if (data.status === 200) {
                  scope.candidate = data.data;
                  scope.selected = formData.startDate + ' - ' + formData.endDate;
                  _buildMonth(scope, previous, scope.month);
                  init();
                } else {
                  scope.candidate = [];
                  commonService.showSnackbar(
                    'error',
                    data.statusText,
                    data.status
                  );
                }
              },
              function (response) {
                scope.candidate = [];
                commonService.showSnackbar(
                  'error',
                  response.statusText,
                  response.status
                );
              }
            );
            init();
          };

          scope.isObjectEmpty = function (card) {
            return Object.keys(card).length === 0;
          };

          // This will hide the DIV by default.

          scope.ShowHidepanel = function () {
            scope.IsVisible = true;
          };

          // Used to edit candidate time log.

          scope.edit = function (index, timelogId, day, year, month) {
            scope.hideEditBtn = false;
            scope.saveHide = true;
            scope.day = day;
            scope.year = year;
            scope.monthNumber = month;
            scope.timeLogIndex = index;
            scope.flag = true;

            for (var i = 0; i < scope.weeks.length; i++) {
              if (
                scope.weeks[i].year === scope.year &&
                scope.weeks[i].month === scope.monthNumber
              ) {
                for (var j = 0; j < scope.weeks[i].days.length; j++) {
                  if (
                    scope.weeks[i].days[j].candidateId ===
                    scope.selectedDay.candidateId &&
                    scope.weeks[i].days[j].number === scope.day
                  ) {
                    scope.timeLogDetails.id = timelogId;
                    scope.timeLogDetails.shift =
                      scope.weeks[i].days[j].timeLog[scope.timeLogIndex].Shift;
                    scope.timeLogDetails.startTime =
                      scope.weeks[i].days[j].timeLog[
                        scope.timeLogIndex
                      ].In_Time;
                    scope.timeLogDetails.endTime =
                      scope.weeks[i].days[j].timeLog[
                        scope.timeLogIndex
                      ].Out_Time;
                    scope.timeLogDetails.hours =
                      scope.weeks[i].days[j].timeLog[scope.timeLogIndex].Hours;
                    scope.timeLogDetails.shiftRepeat =
                      scope.weeks[i].days[j].timeLog[
                        scope.timeLogIndex
                      ].Shift_Repeat;
                    scope.selectedProfile =
                      scope.weeks[i].days[j].timeLog[
                        scope.timeLogIndex
                      ].Shift_Job_Profile_Id;
                  }
                }
              }
            }
          };

          // Used to save edit data.
          scope.editTimeLog = function () {
            var storeI = 0;
            var storeJ = 0;

            for (var i = 0; i < scope.weeks.length; i++) {
              if (
                scope.weeks[i].year === scope.year &&
                scope.weeks[i].month === scope.monthNumber
              ) {
                for (var j = 0; j < scope.weeks[i].days.length; j++) {
                  if (
                    scope.timeLogDetails.shiftRepeat === 'Daily' &&
                    scope.weeks[i].days[j].candidateId ===
                    scope.selectedDay.candidateId
                  ) {
                    scope.weeks[i].days[j].timeLog.id = scope.timeLogDetails.id;
                    scope.weeks[i].days[j].timeLog.shift =
                      scope.timeLogDetails.shift;
                    scope.weeks[i].days[j].timeLog.startTime =
                      scope.timeLogDetails.startTime;
                    scope.weeks[i].days[j].timeLog.endTime =
                      scope.timeLogDetails.endTime;
                    scope.weeks[i].days[j].timeLog.hours =
                      scope.timeLogDetails.hours;
                    scope.weeks[i].days[j].timeLog.shiftRepeat =
                      scope.timeLogDetails.shiftRepeat;
                    scope.weeks[i].days[j].timeLog.profile =
                      scope.selectedProfile;
                    scope.weeks[i].days[j].timeLog.Profile_Name =
                      scope.timeLogDetails.Profile_Name;
                    scope.timeLogDetails.day = scope.day;
                    scope.timeLogDetails.month = scope.monthNumber;
                    scope.timeLogDetails.year = scope.year;
                    scope.timeLogDetails.employerId =
                      scope.employerProfileDetails.employersProfiles[0].Employer_Id;
                    scope.timeLogDetails.employerShiftId =
                      scope.profileShift[0].shiftJobProfiles[0].Employer_Shift_Id;
                    scope.timeLogDetails.weekNo = 0;
                    scope.timeLogDetails.employerProfileId =
                      scope.profileShift[0].Employer_Profile_Id;
                    scope.timeLogDetails.shiftJobProfileId =
                      scope.selectedProfile;

                    updateTimeSheetDetails(
                      scope.timeLogDetails,
                      scope,
                      i,
                      j
                    ).then(function (reponse) {
                      if (reponse && reponse.response.data) {
                        let timeObj = {
                          Candidate_Id: reponse.response.data.Candidate_Id,
                          Day: reponse.response.Day,
                          Employer_Id: reponse.response.data.Employer_Id,
                          Employer_Shift_Id: reponse.response.data.Employer_Shift_Id,
                          Hours: reponse.response.data.Hours,
                          In_Time: reponse.response.data.In_Time,
                          Month: reponse.response.data.Month,
                          Out_Time: reponse.response.data.Out_Time,
                          Shift: reponse.response.data.Shift,
                          Shift_Job_Profile_Id: reponse.response.data.Shift_Job_Profile_Id,
                          profileName: getProfileName(
                            scope,
                            reponse.response.data.Shift_Job_Profile_Id
                          ),
                          Shift_Repeat: reponse.response.data.Shift_Repeat,
                          Week_No: 0,
                          Year: reponse.response.data.Year,
                          id: reponse.response.data.id
                        };

                        if (
                          scope.weeks[reponse.iValue].days[reponse.jValue]
                          .candidateId === scope.selectedDay.candidateId
                        ) {
                          scope.weeks[reponse.iValue].days[
                            reponse.jValue
                          ].timeLog.splice(scope.timeLogIndex, 1, timeObj);
                        }
                      }
                    });
                    break;
                  } else {
                    if (
                      scope.weeks[i].days[j].candidateId ===
                      scope.selectedDay.candidateId &&
                      scope.weeks[i].days[j].number === scope.day
                    ) {
                      scope.weeks[i].days[j].timeLog.id =
                        scope.timeLogDetails.id;
                      scope.weeks[i].days[j].timeLog.shift =
                        scope.timeLogDetails.shift;
                      scope.weeks[i].days[j].timeLog.startTime =
                        scope.timeLogDetails.startTime;
                      scope.weeks[i].days[j].timeLog.endTime =
                        scope.timeLogDetails.endTime;
                      scope.weeks[i].days[j].timeLog.hours =
                        scope.timeLogDetails.hours;
                      scope.weeks[i].days[j].timeLog.shiftRepeat =
                        scope.timeLogDetails.shiftRepeat;
                      scope.weeks[i].days[j].timeLog.profile =
                        scope.selectedProfile;
                      scope.timeLogDetails.day = scope.day;
                      scope.timeLogDetails.month = scope.monthNumber;
                      scope.timeLogDetails.year = scope.year;
                      scope.timeLogDetails.employerId =
                        scope.employerProfileDetails.employersProfiles[0].Employer_Id;
                      scope.timeLogDetails.employerShiftId =
                        scope.profileShift[0].shiftJobProfiles[0].Employer_Shift_Id;
                      scope.timeLogDetails.lastModifiedAt = new Date();
                      scope.timeLogDetails.weekNo = 0;
                      scope.timeLogDetails.employerProfileId =
                        scope.timeLogDetails.profile;
                      scope.timeLogDetails.shiftJobProfileId =
                        scope.selectedProfile;
                      storeI = angular.copy(i);
                      storeJ = angular.copy(j);
                      updateTimeSheetDetails(
                        scope.timeLogDetails,
                        scope,
                        i,
                        j
                      ).then(function (reponse) {
                        let timeObj = {
                          Candidate_Id: reponse.response.data.Candidate_Id,
                          Day: reponse.response.Day,
                          Employer_Id: reponse.response.data.Employer_Id,
                          Employer_Shift_Id: reponse.response.data.Employer_Shift_Id,
                          Hours: reponse.response.data.Hours,
                          In_Time: reponse.response.data.In_Time,
                          Month: reponse.response.data.Month,
                          Out_Time: reponse.response.data.Out_Time,
                          Shift: reponse.response.data.Shift,
                          Shift_Job_Profile_Id: reponse.response.data.Shift_Job_Profile_Id,
                          profileName: getProfileName(
                            scope,
                            reponse.response.data.Shift_Job_Profile_Id
                          ),
                          Shift_Repeat: reponse.response.data.Shift_Repeat,
                          Week_No: 0,
                          Year: reponse.response.data.Year,
                          id: reponse.response.data.id
                        };
                        scope.weeks[reponse.iValue].days[
                          reponse.jValue
                        ].timeLog.splice(scope.timeLogIndex, 1, timeObj);
                      });
                      break;
                    }
                  }
                }
              }
            }

            scope.timeLogDetails = {};
            scope.selectedProfile = '';
            scope.hideEditBtn = true;
            scope.saveHide = false;
            scope.timeLogForm.$setPristine();
          };

          function updateTimeSheetDetails(
            timeLogDetails,
            scope,
            iValue,
            jValue
          ) {
            var currentDate = new Date();
            var date = currentDate.getDate();
            var month = currentDate.getMonth();
            var year = currentDate.getFullYear();

            for (var i = 0; i < scope.selectedDay.timeLog.length; i++) {
              var timeObj = {
                id: scope.selectedDay.timeLog[i].id,
                Candidate_Id: scope.selectedDay.candidateId,
                Created_At: timeLogDetails.month +
                  '-' +
                  timeLogDetails.day +
                  '-' +
                  timeLogDetails.year,
                Employer_Shift_Id: timeLogDetails.employerShiftId,
                Hours: timeLogDetails.hours,
                In_Time: timeLogDetails.startTime === undefined ? 0 : timeLogDetails.startTime,
                LastModified_At: month + 1 + '-' + date + '-' + year,
                Out_Time: timeLogDetails.endTime === undefined ? 0 : timeLogDetails.endTime,
                Shift_Job_Profile_Id: timeLogDetails.shiftJobProfileId,
                Week_No: timeLogDetails.weekNo,
                Month: timeLogDetails.month,
                Day: timeLogDetails.day,
                Year: timeLogDetails.year,
                Shift_Repeat: timeLogDetails.shiftRepeat
              };

              return calenderService.updateTimeSheetDetails(timeObj).then(
                function (response) {
                  let responseObject = {
                    response: response,
                    iValue: iValue,
                    jValue: jValue
                  };

                  if (response.status === 200) {
                    commonService.showSnackbar(
                      'info',
                      'Time Log Updated Successfully',
                      response.status
                    );
                  } else {
                    responseObject = response;
                    commonService.showSnackbar(
                      'error',
                      'Error While Updating The Time Log',
                      response.status
                    );
                  }

                  return responseObject;
                },
                function (response) {
                  commonService.showSnackbar(
                    'error',
                    'Error While Updating The Time Log',
                    response.status
                  );
                  return null;
                }
              );
            }
          }

          // Used to Delete TimeLog

          scope.deleteTimeLog = function (index, timelogId, day, year, month) {
            for (var i = 0; i < scope.weeks.length; i++) {
              if (
                scope.weeks[i].year === year &&
                scope.weeks[i].month === month
              ) {
                for (var j = 0; j < scope.weeks[i].days.length; j++) {
                  if (
                    scope.weeks[i].days[j].number === day &&
                    scope.weeks[i].days[j].candidateId ===
                    scope.selectedDay.candidateId
                  ) {
                    scope.weeks[i].days[j].timeLog.splice(index, 1);
                    let formData = {
                      id: timelogId
                    };
                    scope.response = [];
                    calenderService.deleteTimeSheetDetails(formData).then(
                      function (data) {
                        if (data.status === 200) {
                          scope.response = data;
                          commonService.showSnackbar(
                            'info',
                            'Time Log Deleted Successfully',
                            data.status
                          );
                        } else {
                          commonService.showSnackbar(
                            'error',
                            'Error While Deleting The Time Log',
                            data.status
                          );
                        }
                      },
                      function (response) {
                        commonService.showSnackbar(
                          'error',
                          'Error While Deleting The Time Log',
                          response.status
                        );
                      }
                    );
                  }
                }
              }
            }
          };

          scope.setTimeLog = function (profieData) {
            var profile = JSON.parse(scope.timeLogDetails.selectedProfile);
            scope.timeLogDetails.profile = profile.id;
            scope.timeLogDetails.Profile_Name = profile.Profile_Name;
          };

          // Used to save timelog
          scope.saveTimeLog = function () {
            scope.showme = true;
            scope.saveHide = true;
            scope.hideEditBtn = true;
            totalTimeInHr = [];
            overTimeHrInWeek = [];
            overTimeHrInDaily = [];
            scope.timeLogDetails.profile = angular.copy(scope.selectedProfile);
            var storeI = 0;
            var storeJ = 0;

            for (var i = 0; i < scope.weeks.length; i++) {
              if (scope.selectedName === scope.weeks[i].name) {
                for (var j = 0; j < scope.weeks[i].days.length; j++) {
                  if (scope.timeLogDetails.shiftRepeat !== 'Daily') {
                    if (
                      scope.selectedDay.number === scope.weeks[i].days[j].number
                    ) {
                      storeI = angular.copy(i);
                      storeJ = angular.copy(j);
                      saveTimeSheet(
                        scope.timeLogDetails,
                        scope,
                        scope.weeks[i].days[j].number,
                        i,
                        j
                      ).then(function (response) {
                        if (response.response && response.response.data) {
                          let timeObj = {
                            Candidate_Id: angular.copy(
                              response.response.data[0].Candidate_Id
                            ),
                            Day: angular.copy(response.response.data[0].Day),
                            Employer_Id: angular.copy(
                              response.response.data[0].Employer_Id
                            ),
                            Employer_Shift_Id: angular.copy(
                              response.response.data[0].Employer_Shift_Id
                            ),
                            Hours: angular.copy(
                              response.response.data[0].Hours
                            ),
                            In_Time: angular.copy(
                              response.response.data[0].In_Time
                            ),
                            Month: angular.copy(
                              response.response.data[0].Month
                            ),
                            Out_Time: angular.copy(
                              response.response.data[0].Out_Time
                            ),
                            Shift: angular.copy(
                              response.response.data[0].Shift
                            ),
                            Shift_Job_Profile_Id: angular.copy(
                              response.response.data[0].Shift_Job_Profile_Id
                            ),
                            profileName: getProfileName(
                              scope,
                              response.response.data[0].Shift_Job_Profile_Id
                            ),
                            Shift_Repeat: angular.copy(
                              response.response.data[0].Shift_Repeat
                            ),
                            Week_No: 0,
                            Year: angular.copy(response.response.data[0].Year),
                            id: angular.copy(response.response.data[0].id)
                          };
                          scope.weeks[storeI].days[storeJ].timeLog.push(
                            timeObj
                          );
                        }
                      });
                    }
                  } else {
                    saveTimeSheet(
                      scope.timeLogDetails,
                      scope,
                      scope.weeks[i].days[j].number,
                      i,
                      j
                    ).then(function (response) {
                      if (response.response && response.response.data) {
                        let timeObj = {
                          Candidate_Id: response.response.data[0].Candidate_Id,
                          Day: response.response.data[0].Day,
                          Employer_Id: response.response.data[0].Employer_Id,
                          Employer_Shift_Id: response.response.data[0].Employer_Shift_Id,
                          Hours: response.response.data[0].Hours,
                          In_Time: response.response.data[0].In_Time,
                          Month: response.response.data[0].Month,
                          Out_Time: response.response.data[0].Out_Time,
                          Shift: response.response.data[0].Shift,
                          Shift_Job_Profile_Id: response.response.data[0].Shift_Job_Profile_Id,
                          profileName: getProfileName(
                            scope,
                            response.response.data[0].Shift_Job_Profile_Id
                          ),
                          Shift_Repeat: response.response.data[0].Shift_Repeat,
                          Week_No: 0,
                          Year: response.response.data[0].Year,
                          id: response.response.data[0].id
                        };
                        scope.weeks[response.iValue].days[
                          response.jValue
                        ].timeLog.push(timeObj);
                      }
                    });
                  }
                }
              }
            }

            scope.timeLogDetails = {};
            scope.selectedProfile = '';
            scope.saveHide = false;
            scope.timeLogForm.$setPristine();
          };

          init();

          function init() {
            window.jQuery('#Timepicker_pannel1').datetimepicker({
              format: 'LT'
            });
            window.jQuery('#Timepicker_pannel2').datetimepicker({
              format: 'LT'
            });
            window.jQuery('#TimepickerEnd_pannel1').datetimepicker({
              format: 'LT'
            });
            window.jQuery('#TimepickerEnd_pannel2').datetimepicker({
              format: 'LT'
            });
          }

          function timeConvert(data) {
            var minutes = data % 60;
            var hours = (data - minutes) / 60;
            return hours + ':' + minutes;
          }

          function formatAMPM(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // The hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
          }

          window.jQuery('#Timepicker_pannel1').on('dp.change', function (e) {
            if (e.date._d === undefined) {
              scope.timeLogDetails.endTime = '';
              scope.timeValidation = false;
              return;
            }

            if (e.date._d !== undefined) {
              scope.stDate = new Date(e.date._d);
              scope.timeLogDetails.startTime = formatAMPM(new Date(e.date._d));
              scope.timeLogDetails.month = new Date(e.date._d).getMonth() + 1;
              scope.timeLogDetails.year = new Date(e.date._d).getFullYear();
              scope.timeLogDetails.day = new Date(e.date._d).getDay();
            }

            if (scope.timeLogDetails.endTime !== '') {
              var beginningTime =
                moment.utc(scope.timeLogDetails.startTime,
                  'h:mma');
              var endTime =
                moment.utc(scope.timeLogDetails.endTime,
                  'h:mma');

              if (beginningTime.isBefore(endTime)) {
                scope.timeValidation = false;
              } else {
                scope.timeValidation = true;
              }

              var timeDifference = moment.duration(endTime.diff(beginningTime));

              if (
                timeDifference._data.hours <= 0 &&
                timeDifference._data.minutes <= 0
              ) {
                scope.timeLogDetails.hours = '';
              } else {
                scope.timeLogDetails.hours =
                  timeDifference._data.hours + ':' + timeDifference._data.minutes;
              }
            }
          });

          scope.checkInValue = function () {
            if (scope.timeLogDetails.startTime === '') {
              scope.timeLogDetails.endTime = '';
              scope.timeValidation = false;
            }
          };

          scope.checkOutValue = function () {
            if (scope.timeLogDetails.endTime === '') {
              scope.timeLogDetails.startTime = '';
              scope.timevalidation = false;
            }
          };

          window.jQuery('#TimepickerEnd_pannel1').on('dp.change', function (e) {
            if (e.date._d === undefined) {
              scope.timeLogDetails.startTime = '';
              scope.timeValidation = false;
              return;
            }

            scope.timeLogDetails.endTime = formatAMPM(new Date(e.date._d));
            var beginningTime = moment.utc(scope.timeLogDetails.startTime, 'h:mma');
            var endTime = moment.utc(scope.timeLogDetails.endTime, 'h:mma');

            if (beginningTime.isBefore(endTime)) {
              scope.timeValidation = false;
            } else {
              scope.timeValidation = true;
            }

            var timeDifference = moment.duration(endTime.diff(beginningTime));

            if (
              timeDifference._data.hours <= 0 &&
              timeDifference._data.minutes <= 0
            ) {
              scope.timeLogDetails.hours = '';
            } else {
              scope.timeLogDetails.hours =
                timeDifference._data.hours + ':' + timeDifference._data.minutes;
            }
          });
        }
      };

      function _removeTime(date) {
        return date
          .day(0)
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0);
      }
      /* Calcuate total time function*/

      function zeroPad(num) {
        var str = String(num);

        if (str.length < 2) {
          return '0' + str;
        }

        return str;
      }

      function totalTimeString(timeStrings) {
        var totals = timeStrings.reduce(
          function (a, timeString) {
            var temp;
            var parts;

            if (timeString === 0) {
              timeString = '00:00:00';
            }

            parts = timeString.split(':');

            if (parts.length > 0) {
              temp = Number(parts.pop()) + a.seconds;
              a.seconds = temp % 60;

              if (parts.length > 0) {
                temp =
                  Number(parts.pop()) + a.minutes + (temp - a.seconds) / 60;
                a.minutes = temp % 60;
                a.hours = a.hours + (temp - a.minutes) / 60;

                if (parts.length > 0) {
                  a.hours += Number(parts.pop());
                }
              }
            }

            return a;
          }, {
            hours: 0,
            minutes: 0,
            seconds: 0
          }
        );

        // Returned string will be HH(H+):mm:ss

        return [
          zeroPad(totals.hours),
          zeroPad(totals.minutes),
          zeroPad(totals.seconds)
        ].join(':');
      }

      function _buildMonth(scope, start, month) {
        var done = false,
          date = start.clone(),
          monthIndex = date.month();
        scope.weeks = [];

        for (var i = 0; i < 7; i++) {
          scope.daysArray[i].date = new moment(date).add(i, 'day').date();
        }

        scope.employeeList[0].forEach(element => {
          if (element.candidateMasters) {
            scope.weeks.push({
              days: _buildWeek(
                scope,
                date.clone(),
                month,
                element.candidateMasters.id
              ),
              name: element.candidateMasters.First_Name +
                ' ' +
                element.candidateMasters.Last_Name,
              month: new Date(month._d).getMonth() + 1,
              year: new Date(month._d).getFullYear(),
              workingHours: 0,
              overTimeHoursDaily: 0,
              overTimeHoursWeekly: 0,
              regularTimeHours: 0
            });
          }
        });
        overTimeHrWeeklySchema(scope);
      }

      function _buildWeek(scope, date, month, candidateId) {
        var days = [];
        days.timeLog = [];

        for (var i = 0; i < 7; i++) {
          days.push({
            name: date.format('dd').substring(0, 1),
            number: date.date(),
            isCurrentMonth: date.month() === month.month(),
            isToday: date.isSame(new Date(), 'day'),
            date: date,
            timeLog: [],
            candidateId: candidateId
          });
          date = date.clone();
          date.add(1, 'd');

          for (var j = 0; j < scope.candidate.length; j++) {
            if (
              candidateId === scope.candidate[j].Candidate_Id &&
              days[i].number === scope.candidate[j].Day
            ) {
              var timeObj = {
                Shift: scope.timeLogDetails.shift[0].Shift,
                Hours: scope.candidate[j].Hours,
                In_Time: scope.candidate[j].In_Time,
                Out_Time: scope.candidate[j].Out_Time,
                profileName: getProfileName(
                  scope,
                  scope.candidate[j].Shift_Job_Profile_Id
                ),
                Shift_Job_Profile_Id: scope.candidate[j].Shift_Job_Profile_Id,
                Shift_Repeat: scope.candidate[j].Shift_Repeat,
                id: scope.candidate[j].id
              };
              days[i].timeLog.push(timeObj);
            }
          }
        }

        return days;
      }

      // This function is used to fetch employers employees list
      function getEmployeesList(scope, employer) {
        var employerObj = JSON.parse(employer);
        var listParam = {
          employerId: employerObj.id
        };

        if (employerObj) {
          scope.employer_Name = employerObj.Employer_Name;
          scope.promise = employerListService.getEmployeeList(listParam).then(
            function (data) {
              if (data.status === 200) {
                scope.employeeList = [];
                var employee = data.data;
                scope.employeeList.push(employee);
                _buildMonth(scope, scope.start, scope.month);
              } else {
                commonService.showSnackbar(
                  'error',
                  data.statusText,
                  data.status
                );
              }
            },
            function (response) {
              commonService.showSnackbar(
                'error',
                response.statusText,
                response.status
              );
            }
          );
        }
      }

      function getEmployerProfileDetails(scope, employer) {
        var employerObj = JSON.parse(employer);
        var listParam = {
          employerId: employerObj.id
        };

        if (employerObj) {
          scope.promise = employerListService
            .getEmployerProfileDetails(listParam)
            .then(
              function (data) {
                if (data.status === 200) {
                  getEmployeesList(scope, scope.employer);
                  scope.employerProfileDetails = data.data;
                  scope.employerProfileShift =
                    scope.employerProfileDetails.employersProfiles[0].employerShifts;
                  scope.profileShift =
                    scope.employerProfileDetails.employersProfiles[0].employerShifts;
                  scope.timeLogDetails.shift =
                    scope.employerProfileDetails.employersProfiles[0].employerShifts;
                  scope.profileList = angular.copy(
                    data.data.employersProfiles[0].employerShifts
                  );
                  var profiles = [];

                  for (var j = 0; j < scope.profileList.length; j++) {
                    for (
                      var i = 0; i < scope.profileList[j].shiftJobProfiles.length; i++
                    ) {
                      if (
                        profiles.includes(
                          scope.profileList[j].shiftJobProfiles[i].jobProfiles
                          .id
                        ) === false
                      ) {
                        profiles.push(
                          scope.profileList[j].shiftJobProfiles[i].jobProfiles
                        );
                      }
                    }
                  }

                  scope.jobProfileList = angular.copy(profiles);
                } else {
                  commonService.showSnackbar(
                    'error',
                    data.statusText,
                    data.status
                  );
                }
              },
              function (response) {
                commonService.showSnackbar(
                  'error',
                  response.statusText,
                  response.status
                );
              }
            );
        }
      }

      // Used to save candidate time sheet.

      function saveTimeSheet(timeLog, scope, dayNumber, iValue, jValue) {
        var currentDate = new Date();
        var date = currentDate.getDate();
        var month = currentDate.getMonth();
        var year = currentDate.getFullYear();
        var timeListObject = [];
        var timeSheet = {
          Candidate_Id: scope.selectedDay.candidateId,
          Employer_Id: scope.employerProfileDetails.employersProfiles[0].Employer_Id,
          Employer_Shift_Id: scope.profileShift[0].shiftJobProfiles[0].Employer_Shift_Id,
          Shift_Job_Profile_Id: timeLog.profile,
          Shift_Profile: getProfileName(scope, timeLog.profile),
          Shift: timeLog.shift,
          In_Time: timeLog.startTime === undefined ? 0 : timeLog.startTime,
          Out_Time: timeLog.endTime === undefined ? 0 : timeLog.endTime,
          Week_No: '',
          Hours: timeLog.hours,
          Month: timeLog.month,
          Year: timeLog.year,
          Day: dayNumber,
          Created_At: month + 1 + '-' + dayNumber + '-' + year,
          LastModified_At: month + 1 + '-' + date + '-' + year,
          Shift_Repeat: scope.timeLogDetails.shiftRepeat
        };
        scope.candidate.push(timeSheet);
        timeListObject.push(timeSheet);
        return calenderService.saveTimeSheetDetails(timeListObject).then(
          function (response) {
            let responseObject = {
              response: response,
              iValue: iValue,
              jValue: jValue
            };

            if (response.status === 200) {
              responseObject.response = response;
              commonService.showSnackbar(
                'info',
                'Time Log Saved Successfully',
                response.status
              );
              timeListObject = [];
            } else {
              responseObject.response = response;
              commonService.showSnackbar(
                'error',
                'Error While Saving The Time Log',
                response.status
              );
            }

            return responseObject;
          },
          function (response) {
            commonService.showSnackbar(
              'error',
              'Error While Saving The Time Log',
              response.status
            );
          }
        );
      }

      function getProfileName(scope, profileId) {
        for (var i = 0; i < scope.jobProfileList.length; i++) {
          if (scope.jobProfileList[i].id === profileId) {
            return scope.jobProfileList[i].Profile_Name;
          }
        }
      }

      // Calculate total hours of wroking
      function overTimeHrWeeklySchema(scope) {
        var timeStart = new Date(
          '01/01/2018 ' + scope.profileShift[0].Start_Time
        );
        var timeEnd = new Date('01/01/2018 ' + scope.profileShift[0].End_Time);
        var constWeekWorkHours = 40;
        var totalTimeInHr = [];
        var regularTimeHours = moment
          .utc(
            moment(timeEnd, 'DD/MM/YYYY hh:mm:ss').diff(
              moment(timeStart, 'DD/MM/YYYY hh:mm:ss')
            )
          )
          .format('hh:mm:ss');

        for (var i = 0; i < scope.weeks.length; i++) {
          for (var j = 0; j < scope.weeks[i].days.length; j++) {
            if (scope.weeks[i].days[j].timeLog.length) {
              for (var k = 0; k < scope.weeks[i].days[j].timeLog.length; k++) {
                totalTimeInHr.push(
                  scope.weeks[i].days[j].timeLog[k].Hours + ':00'
                );
                scope.weeks[i].regularTimeHours = regularTimeHours;
                scope.weeks[i].workingHours = totalTimeString(totalTimeInHr);

                if (
                  parseFloat(scope.weeks[i].workingHours) > constWeekWorkHours
                ) {
                  scope.weeks[i].overTimeHoursWeekly =
                    parseFloat(scope.weeks[i].workingHours) -
                    constWeekWorkHours;
                }
              }
            }
          }

          totalTimeInHr = [];
        }
      }

      //  OverTime hours Daily schema calculations

      function overTimeHrDailySchema(scope) {
        var timeStart = new Date(
          '01/01/2018 ' + scope.profileShift[0].Start_Time
        );
        var timeEnd = new Date('01/01/2018 ' + scope.profileShift[0].End_Time);
        var regularTimeHours = moment
          .utc(
            moment(timeEnd, 'DD/MM/YYYY hh:mm:ss').diff(
              moment(timeStart, 'DD/MM/YYYY HH:mm:ss')
            )
          )
          .format('HH:mm:ss');
        var constWeekHours = 40;
        var dailyHrArray = [];
        var dailyTotalHours = '';
        var totalTimeInHr = [];
        var dailyExtraHrArray = [];
        var dailyHrFormat = '';
        var regularHrFormat = '';
        var dailyExtraHours = '';

        for (var i = 0; i < scope.weeks.length; i++) {
          for (var j = 0; j < scope.weeks[i].days.length; j++) {
            if (scope.weeks[i].days[j].timeLog) {
              for (var k = 0; k < scope.weeks[i].days[j].timeLog.length; k++) {
                totalTimeInHr.push(
                  scope.weeks[i].days[j].timeLog[k].Hours + ':00'
                );
                scope.weeks[i].regularTimeHours = regularTimeHours;
                dailyHrArray.push(
                  scope.weeks[i].days[j].timeLog[k].Hours + ':00'
                );
                dailyTotalHours = totalTimeString(dailyHrArray);
                scope.weeks[i].workingHours = totalTimeString(totalTimeInHr);

                // Diffreance between daily working hours and regular hours.//

                if (
                  parseFloat(dailyTotalHours) >
                  parseFloat(scope.weeks[i].regularTimeHours)
                ) {
                  dailyHrFormat = new Date('01/01/2018 ' + dailyTotalHours);
                  regularHrFormat = new Date(
                    '01/01/2018 ' + scope.weeks[i].regularTimeHours
                  );
                  dailyExtraHours = moment
                    .utc(
                      moment(dailyHrFormat, 'DD/MM/YYYY hh:mm:ss').diff(
                        moment(regularHrFormat, 'DD/MM/YYYY HH:mm:ss')
                      )
                    )
                    .format('HH:mm:ss');
                  dailyExtraHrArray.push(dailyExtraHours);
                  scope.weeks[i].overTimeHoursDaily = totalTimeString(
                    dailyExtraHrArray
                  );
                }
              }

              dailyExtraHrArray = [];
              dailyHrArray = [];
            }
          }

          totalTimeInHr = [];
        }
      }
    });
})();
