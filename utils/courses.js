//API to get the course information from va tech.

//Class for campus type.
class Campus{
    BLACKSBURG = '0';
    VIRTUAL = '10';
}

//Class for day of the week course is. 
class Day{
    MONDAY = 'Monday';
    TUESDAY = 'Tuesday';
    WEDNESDAY = 'Wednesday';
    THURSDAY = 'Thursday';
    FRIDAY = 'Friday';
    SATURDAY = 'Saturday';
    SUNDAY = 'Sunday';
    ARRANGED = 'Arranged';
}

//Class for the modality of the course
class Modality{
    ALL = '%';
    IN_PERSON = 'A';
    HYBRID = 'H';
    ONLINE_SYNC = 'N';
    ONLINE_ASYNC = 'O';
}

//Class for the pathways the course staisfies.
class Pathway{

    ALL = 'AR%';
    CLE_1 = 'AR01';
    CLE_2 = 'AR02';
    CLE_3 = 'AR03';
    CLE_4 = 'AR04';
    CLE_5 = 'AR05';
    CLE_6 = 'AR06';
    CLE_7 = 'AR07';
    PATH_1A = 'G01A';
    PATH_1F = 'G01F';
    PATH_2 = 'G02';
    PATH_3 = 'G03';
    PATH_4 = 'G02';
    PATH_5A = 'G02';
    PATH_5F = 'G02';
    PATH_6A = 'G06A';
    PATH_6D = 'G06D';
    PATH_7 = 'G07';
}

//Used to get information about the semester
class Semester{
    
    SPRING = '01';
    SUMMER = '06';
    FALL = '09';
    WINTER = '12';
}

class SectionType{

    ALL = '%';
    INDEPENDENT_STUDY = '%I%';
    LAB = '%B%';
    LECTURE = '%L%';
    RECITATION = '%C%';
    RESEARCH = '%R%';
    ONLINE = 'ONLINE';
}

//Used to see if the class is open or not
class Status{
    ALL = '';
    OPEN = 'on';
}

//Used as a container for information about vt courses
class Course{

    _section_type_dct = {'I' : SectionType.INDEPENDENT_STUDY,
                         'B': SectionType.LAB,
                         'L': SectionType.LECTURE,
                         'C': SectionType.RECITATION,
                         'R': SectionType.RESEARCH,
                         'O': SectionType.ONLINE};

    _modality_dct = {'Face-to-Face Instruction': Modality.IN_PERSON,
                         'Hybrid (F2F & Online Instruc.)': Modality.HYBRID,
                         'Online with Synchronous Mtgs.': Modality.ONLINE_SYNC,
                         'Online: Asynchronous': Modality.ONLINE_ASYNC};

    _day_dct = {'M': Day.MONDAY, 'T': Day.TUESDAY, 'W': Day.WEDNESDAY,
                         'R': Day.THURSDAY, 'F': Day.FRIDAY, 'S': Day.SATURDAY,
                         'U': Day.SUNDAY, '(ARR)': Day.ARRANGED};

    constructor(year, semester, timetable_data, extra_class_data)
    {
        subject, code = timetable_data[1].match('(.+)-(.+)').group(1, 2);
        semester = this.Semester;

        //Stuck here --------------------------------------------------------

    }
        
}



//Returns a single course if it exists with this crn otherwise nothing.
function getCRN(year, semester, crn)
{
    crn_search = search_timetable(year, semester, crn);
    if(crn_search)
    {
        return crn_search[0];
    }
}

function search_timetable(year, semester, campus, pathway, subject, section_type, code, crn, status, modality)
{
    semester = Semester;
    campus = Campus.BLACKSBURG;
    pathway = Pathway.ALL;
    section_type = SectionType.ALL;
    status = Status.ALL;
    modality = Modality.ALL;

    //Setting the correct term year
    if(semester == Semester.WINTER)
    {
        term_year = ''+ (int(year) - 1);
    }
    else
    {
        term_year = (year + semester.value) +'';

    }
    //Setting the correct subject
    if(subject == '%')
    {
        subject == '';
    }

    var request_data={'CAMPUS': campus,
                                          'TERMYEAR': term_year,
                                          'CORE_CODE': pathway,
                                          'subj_code': subject,
                                          'SCHDTYPE': section_type,
                                          'CRSE_NUMBER': code,
                                          'crn': crn,
                                          'open_only': status,
                                          'sess_code': modality,
                                          };

    var request = makeRequest('post', request_data);

    //If there are no matches return empty list
    if(request == '')
    {
        return [];
    }

    request_data = html
    //Need to read html tables, not sure what to use in js library

}

function makeRequest(requestType, requestData)
{
    var url = 'https://apps.es.vt.edu/ssb/HZSKVTSC.P_ProcRequest';
    if(requestType == 'post')
    {
        

    }

}

export {getCRN, Semester}

