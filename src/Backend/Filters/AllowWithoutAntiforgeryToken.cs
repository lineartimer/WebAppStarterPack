namespace Backend.Filters;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
public class AllowWithoutAntiforgeryToken : Attribute
{
}
