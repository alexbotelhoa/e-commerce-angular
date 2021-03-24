import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectTeacherClass } from "../../../shared/repositories/teacher-class.repository";
import { getOneOrNull } from "../../../shared/utils/get-one-or-null.util";
import { getZoomLink } from "../services/zoom-link.service";

export const getZoomUrlQueryResolver: GQLQueryResolvers['getZoom'] = async (obj, params, context) => {
    const teacherClass = getOneOrNull(await selectTeacherClass(context.database).where("classId", "=", params.classId))
    if (teacherClass?.teacherId) {
        return getZoomLink(teacherClass?.teacherId, context.database, context.logger);
    }
    throw Error("No teacher found.")
}
